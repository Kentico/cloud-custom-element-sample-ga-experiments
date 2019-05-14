import React from 'react';
import Select from 'react-select';
import '../analytics_logo.png';

type IValue = [string, string, IStructuredValue];

interface IStructuredValue {
  experiment: {
    id: string;
    name: string;
  } | null;
  variant: {
    id: string;
    name: string;
  } | null;
}

interface IVariation {
  name: string;
}

interface IExperiment {
  name: string;
  id: string;
  variations: IVariation[];
}

interface IOption {
  value: string;
  label: string;
}

interface IExperimentSelectorProps {
  initialValue: IValue | null;
  disabled: boolean;
  customElementApi: any;
  clientId: string;
  accountId: string;
  webPropertyId: string;
  profileId: string;
}

interface IExperimentSelectorState {
  selectedExperiment: IOption | null;
  selectedVariant: IOption | null;
  experiments: IExperiment[] | null;
  experimentOptions: IOption[] | null;
  variantOptions: IOption[] | null;
  apiKey: string | null;
  disabled: boolean;
  signedIn: boolean;
}

class ExperimentSelector extends React.Component<IExperimentSelectorProps, IExperimentSelectorState> {
  private gapi: any;

  constructor(props) {
    super(props);

    this.gapi = (window as any).gapi;

    props.customElementApi.onDisabledChanged((disabled) => {
      this.setDisabled(!!disabled);
    });

    const selected: IValue = props.initialValue;

    // Last item in value is the structured value for the UI
    const structuredValue = selected && selected[selected.length - 1] as IStructuredValue;

    this.state = {
      selectedExperiment: structuredValue && structuredValue.experiment && {
        value: structuredValue.experiment.id,
        label: structuredValue.experiment.name,
      },
      selectedVariant: structuredValue && structuredValue.variant && {
        value: structuredValue.variant.id,
        label: structuredValue.variant.name,
      },
      experiments: null,
      experimentOptions: null,
      variantOptions: null,
      apiKey: null,
      disabled: props.disabled,
      signedIn: false,
    };

    this.onExperimentChange = this.onExperimentChange.bind(this);
  }

  componentDidMount() {
    this.loadClient();
    this.deferredUpdateSize();

    window.addEventListener('resize', this.updateSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  ensureSignIn = () => {
    if (!this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.gapi.auth2.getAuthInstance().signIn();
    }
  };

  signOut = () => {
    if (this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.gapi.auth2.getAuthInstance().signOut();
      this.setState(() => ({
        experiments: null,
        experimentOptions: null,
        variantOptions: null,
      }));
    }
  };

  loadClient = () => {
    this.gapi.load('client:auth2', this.initClient);
  };

  initClient = () => {
    this.gapi.client.init({
      apiKey: this.state.apiKey,
      discoveryDocs: [
        'https://content.googleapis.com/discovery/v1/apis/analytics/v3/rest',
      ],
      clientId: this.props.clientId,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
    }).then(() => {
      const isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn;

      isSignedIn.listen(this.updateSignInStatus);
      this.updateSignInStatus(isSignedIn.get());
    });
  };

  updateSignInStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      this.loadExperiments();
    }
    this.setState(() => ({ signedIn: isSignedIn }));
  };

  setDisabled = (disabled: boolean) => {
    this.setState(() => ({ disabled }));
  };

  getExperimentsFromResponse = (response: any): IExperiment[] | null => {
    if (response.error && response.error.code === 401) {
      this.ensureSignIn();
      return null;
    }

    const experiments = response
      .items
      .map(e => ({
        name: e.name,
        id: e.id,
        variations: e.variations.map(v => ({
          name: v.name,
        })),
      }));

    return experiments;
  };

  loadExperiments = () => {
    this.gapi.client.request({
      path: `/analytics/v3/management/accounts/${this.props.accountId}/webproperties/${this.props.webPropertyId}/profiles/${this.props.profileId}/experiments`,
    }).execute(response => {
      const experiments = this.getExperimentsFromResponse(response);
      if (experiments) {
        this.updateExperiments(experiments);
      }
    });
  };

  updateExperiments = (experiments: IExperiment[]) => {
    this.setState(
      () => ({
        experiments,
        experimentOptions: experiments.map(e => ({
          label: e.name,
          value: e.id,
        })),
      }),
      this.loadVariantsForSelected);
  };

  deferredUpdateSize = () => {
    setTimeout(this.updateSize, 10);
  };

  updateSize = () => {
    const height = document.documentElement.offsetHeight;
    this.props.customElementApi.setHeight(height);
  };

  updateValue = (experiment: IOption | null, variant: IOption | null) => {
    if (!experiment || !variant) {
      this.props.customElementApi.setValue(null);
      return;
    }

    const value: IValue = [
      experiment.value,
      variant.value,
      {
        experiment: experiment && {
          id: experiment.value,
          name: experiment.label,

        },
        variant: variant && {
          id: variant.value,
          name: variant.label,
        },
      }
    ];

    this.props.customElementApi.setValue(JSON.stringify(value));
  };

  loadVariants = (experiment: IOption | null) => {
    const experimentObj = experiment && this.state.experiments && this.state.experiments.find(e => e.id === experiment.value) || null;
    const variantOptions = experimentObj && experimentObj.variations.map((v, index) => ({
      value: index + '',
      label: v.name || 'Original',
    }));

    this.setState(() => ({
      variantOptions,
    }));
  };

  loadVariantsForSelected = () => {
    this.loadVariants(this.state.selectedExperiment);
  };

  updateSelectedExperiment = (experiment: IOption | null) => {
    const sameAsSelected = this.state.selectedExperiment && experiment && (this.state.selectedExperiment.value === experiment.value);

    this.setState(prevState => ({
      selectedExperiment: experiment,
      selectedVariant: sameAsSelected ? prevState.selectedVariant : null,
    }));
    this.updateValue(experiment, null);
    this.deferredUpdateSize();
  };

  onExperimentChange = (experiment: IOption | null) => {
    if (!this.state.disabled) {
      this.loadVariants(experiment);
      this.updateSelectedExperiment(experiment);
    }
  };

  onVariantChange = (variant: IOption | null) => {
    if (!this.state.disabled) {
      this.setState(() => ({
        selectedVariant: variant,
      }));
      this.updateValue(this.state.selectedExperiment, variant);
      this.deferredUpdateSize();
    }
  };

  render() {
    const { selectedExperiment, selectedVariant } = this.state;

    const experimentOptions = this.state.experimentOptions || selectedExperiment && [selectedExperiment] || [];
    const variantOptions = this.state.variantOptions || selectedVariant && [selectedVariant];

    return (
      <div className="selectors">
        <div className="selector-wrapper">
          <Select
            isClearable
            defaultValue={selectedExperiment}
            options={experimentOptions}
            onMenuOpen={this.loadExperiments}
            isDisabled={this.state.disabled}
            onChange={this.onExperimentChange}
            classNamePrefix="selector"
            placeholder="Select experiment ..."
          />
          <div className="selector-label">Experiment</div>
        </div>
        <div className="selector-wrapper">
          {variantOptions &&
          <>
            <Select
              isClearable
              key={selectedExperiment && selectedExperiment.value}
              defaultValue={selectedVariant}
              options={variantOptions}
              onMenuOpen={this.loadExperiments}
              isDisabled={this.state.disabled}
              onChange={this.onVariantChange}
              classNamePrefix="selector"
              placeholder="Select variant ..."
            />
            <div className="selector-label">Variant</div>
          </>
          }
        </div>
        <div>
          <img
            className="logo"
            src="analytics_logo.png"
          />
          {!this.state.disabled &&
            <div className="buttons">
              {this.state.signedIn ?
                <button onClick={this.signOut}>Sign out</button> :
                <button onClick={this.ensureSignIn}>Sign in</button>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

export default ExperimentSelector;
