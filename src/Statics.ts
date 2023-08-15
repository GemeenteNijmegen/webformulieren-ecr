export class Statics {
  /**
   * Use this name for tags
   */
  static readonly projectName = 'webformulieren-ecr';

  /**
   * The repository to watch
   */
  static readonly repo = 'GemeenteNijmegen/webformulieren-ecr';

  /**
   * Accounts which will be pulling form the ecr repos managed in this project
   */
  static readonly gnWebformsDev = '033598396027';
  static readonly gnWebformsAccp = '338472043295';
  static readonly gnWebformsProd = '147064197580';

  /**
   * The build environment (deployed from and to)
   */
  static readonly gnBuildEnvironment = {
    account: '836443378780',
    region: 'eu-central-1',
  };

}