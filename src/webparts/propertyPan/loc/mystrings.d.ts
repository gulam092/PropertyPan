declare interface IPropertyPanWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  ListUrl:string;
}

declare module 'PropertyPanWebPartStrings' {
  const strings: IPropertyPanWebPartStrings;
  export = strings;
}
