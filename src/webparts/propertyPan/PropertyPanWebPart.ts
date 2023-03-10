import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  IPropertyPaneSliderProps,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PropertyPanWebPart.module.scss';
import * as strings from 'PropertyPanWebPartStrings';

export interface IPropertyPanWebPartProps {
  description: string;
  ListUrl:string;
  percentageComplete:string;
  ValidationRequired:boolean;
  ListName:string;
}

export default class PropertyPanWebPart extends BaseClientSideWebPart<IPropertyPanWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.propertyPan} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.welcome}">
        <img alt="" src="${this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png')}" class="${styles.welcomeImage}" />
        <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        <div>${this._environmentMessage}</div>
        <div>Web part property value: <strong>${escape(this.properties.description)}</strong></div>
        <div> <strong>${escape(this.properties.percentageComplete)}</strong></div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <p>
      
        </p>
        <h4>Learn more about SPFx development:</h4>
          <ul class="${styles.links}">
           
          </ul>
      </div>
    </section>`;
  }

  public ValidateListUrl(value:string):string{
    if(value.length>256){
      return "URL Should be Less than 256 Character";
    }
    if(value.length==0){
      return "Enter List Url";
    }
    return "";
  }
  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }



  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('ListUrl', {
                  label: strings.ListUrl,
                  onGetErrorMessage:this.ValidateListUrl.bind(this),
                }),
                PropertyPaneSlider('percentageComplete', {
                  label: "percent Complete",
                  min:0,
                  max:100
                }),
                PropertyPaneCheckbox('ValidationRequired', {
                  text:"Validation Required"
                }),
                PropertyPaneDropdown("ListName",{label:"Select Your List",options:[{
                  key:"--Select Your List--",
                  text:"--Select Your List --"
                },
                {
                  key: 'myDocuments',
                  text: 'My Documents'
                },
                {
                  key: 'Test',
                  text: 'My Test'
                },
                {
                  key: 'Handsome',
                  text: 'My handsome'
                }
              
              ],
              selectedKey:"--Select Your List--",

                })

              ]
            }
          ]
        }
      ]
    };
  }
}
