export enum SettingsType{
    AIModel =  'aimodel',
    Language = 'language',
    recordAllContact = 'recordallcontact'
}

export enum Language{
    english = 'en-US',
    bangla = 'bn-BD'
}

export interface AlertCategory{
    'hate': boolean;
    'hate/threatening': boolean;
    'self-harm': boolean;
    'sexual': boolean;
    'sexual/minors': boolean;
    'violence': boolean;
    'violence/graphic': boolean;
}

export interface CategoryScore {
    'hate': number;
    'hate/threatening': number;
    'self-harm': number;
    'sexual': number;
    'sexual/minors': number;
    'violence': number;
    'violence/graphic': number;
}

export interface ALertType{
    categories: AlertCategory;
    category_scores: CategoryScore,
}

export interface FineTuneCategory{
    'slang': boolean;
    'pornography': boolean;
    'drugs': boolean;
    'sales': boolean;
}