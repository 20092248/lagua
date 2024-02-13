export class CONSTANTS {
    public static EMAIL_API_KEY = '7792824167F5A4C62E677DAF0C3D292C100942D1707DE9A9D217C120DC0021296AC543EB3C786B9A28EB9C0CCF9B686A';
    public static URL_SEND_GRID = 'https://api.sendgrid.com/v3/mail/send';
    public static TEAM_LAGUA_NAME = 'Team Lagua';
    public static TEAM_LAGUA_EMAIL = 'lagua.shikomori@gmail.com';
    public static LOGIN_KO = 'Une erreur est survenue lors de la connexion. Veuillez réessayer ultérieurement.';
    public static NOT_SIGNIN = 'Veuillez créer un compte avant de vous connecter.';
    public static SEND_EMAIL_KO = 'Une erreur est survenue lors de l\'envoi du mail. Veuillez réessayer ultérieurement.';
    public static UPDATE_DAY_CONNECTED_KO = 'Une erreur est survenue lors de la connexion de l\'utilisateur.';
    public static UPDATE_DIALECT_KO = 'Une erreur est survenue lors de la mise à jour du dialecte.';
    public static FORMAT_EMAIL_KO = 'Veuillez renseigner un email valide.';
    public static CHOICE_DIALECT_MISSING = 'Sélectionner un choix avant de cliquer sur Valider.';
    public static SHARE_MSG_TITLE = 'Essaie ça !';
    public static SHARE_MSG_OBJECT = 'J\'utilise une application d\'apprentissage linguistique appelée Lagua et je pense qu\'elle pourrait te plaire aussi. Suis ce lien si tu veux en savoir plus : https://lagua-shikomori.web.app. Cette application m\'aide à apprendre plus vite et elle est très amusante !'
    public static CONFIRM_ACTION_SHEET = 'Êtes-vous sûr de vouloir changer de dialecte?';
    public static CONFIRM_DELETE_ACCOUNT_ACTION_SHEET = 'Êtes-vous sûr de vouloir supprimer votre compte? Votre compte va être définitivement supprimé de nos systèmes.';
    public static CONFIRM_DIALECT_CHANGED = 'Le changement de dialecte a été effectué.';
    public static FORGOT_PASSWORD_HEADER = 'Mot de passe oublié ?';
    public static FORGOT_PASSWORD_SUBHEADER = 'Veuillez saisir votre email de connexion afin de recevoir le lien de réinitialisation de votre mot de passe.';
    public static FORGOT_PASSWORD_LABEL_SUCCESS = 'Vous allez recevoir un message à l\'adresse ';
    public static COLLECTION_DIALOG = 'shikomori_francais_dialogs';
    public static FRENCH_DIALECT = 'FREN';
    public static transcodeCollectionQuestions: { [key: string]: string } = {
        ['SHAN']: 'shindzuani_francais_questions',
        ['SHGC']: 'shingazidza_francais_questions',
        ['MAOR']: 'shimaore_francais_questions',
        ['MOHE']: 'shimwali_francais_questions'
    };
    public static transcodeCollectionTopics: { [key: string]: string } = {
        ['SHAN']: 'shindzuani_francais_topics',
        ['SHGC']: 'shingazidza_francais_topics',
        ['MAOR']: 'shimaore_francais_topics',
        ['MOHE']: 'shimwali_francais_topics'
    };
    public static transcodeDialect: { [key: string]: string } = {
        ['SHAN']: 'shindzuani',
        ['SHGC']: 'shingazidza',
        ['MAOR']: 'shimaore',
        ['MOHE']: 'shimwali'
    };
    public static transcodeDialectLabel: { [key: string]: string } = {
        ['SHAN']: 'l\'anjouanais',
        ['SHGC']: 'le grand-comorien',
        ['MAOR']: 'le mahorais',
        ['MOHE']: 'le mohélien'
    };
    public static transcodeDialectLabelWithoutNoun: { [key: string]: string } = {
        ['SHAN']: 'anjouanais',
        ['SHGC']: 'grand-comorien',
        ['MAOR']: 'mahorais',
        ['MOHE']: 'mohélien'
    };
    public static transcodeQuestion: { [key: string]: string } = { 
        ['SHAN']: 'shindzuani_francais_questions',
        ['SHGC']: 'shingazidza_francais_questions',
        ['MAOR']: 'shimaore_francais_questions',
        ['MOHE']: 'shimwali_francais_questions'
    };
    public static topicDocument: { [key: string]: any } = {
        ['ANIMAL']: {code: 'animals', value: 'Les animaux'},
        ['CLOTHE']: {code: 'clothes', value: 'Les vêtements'},
        ['COLOR']: {code: 'colors', value: 'Les couleurs'},
        ['FAMILY']: {code: 'family', value: 'La famille'},
        ['FOOD']: {code: 'food', value: 'La nourriture'},
        ['HOME']: {code: 'home', value: 'La maison'},
        ['HUMAN_BODY']: {code: 'human_body', value: 'Le corps humain'},
        ['MUSIC']: {code: 'music', value: 'La musique'},
        ['SCHOOL']: {code: 'school', value: 'L\'école'},
        ['SEA']: {code: 'sea', value: 'La mer'},
        ['TOOL']: {code: 'tools', value: 'Les outils'},
        ['TREE']: {code: 'trees', value: 'Les arbres'},
        ['COUNT']: {code: 'count', value: 'Les nombres'},
    };    
    public static dialect: { [key: string]: string } = {
        ['ALL']: 'Comorien (Tous les dialectes)',
        ['SHINDZUANI']: 'Anjouanais',
        ['SHINGAZIDZA']: 'Grand-comorien',
        ['SHIMAORE']: 'Mahorais',
        ['SHIMWALI']: 'Mohélien',
        ['FRENCH']: 'Français',
    };
    public static symbol: { [key: string]: string } = {
        ['acc.']: 'accordable',
        ['adj.']: 'adjectif',
        ['adj. acc.']: 'adjectif accordable',
        ['adj. inv.']: 'adjectif invariable',
        ['adj. var.']: 'adjectif variable',
        ['adj. comp.']: 'adjectif composé',
        ['adj. poss.']: 'adjectif possessif',
        ['adj. dem.']: 'adjectif démonstratif',
        ['adj. ind.']: 'adjectif indéfini',
        ['adj. num']: 'adjectif numéral',
        ['adj. comp. acc.']: 'adjectif composé accordable',
        ['adj. n. masc.']: 'adjectif nom masculin',      
        ['adj. subst.']: 'adjectif',  
        ['adv.']: 'adverbe',
        ['adv. ind.']: 'adverbe indéfini',
        ['adv. int.']: 'adverbe interrogatif',
        ['adv. tps.']: 'adverbe de temps',
        ['adv. lieu.']: 'adverbe de lieu',
        ['conj.']: 'conjonction',
        ['conj. sub.']: 'conjonction de subordination',
        ['conn.']: 'connectif',
        ['conn. acc.']: 'connectif accordable',
        ['cra.']: 'crase',
        ['exl.']: 'exclamatif',
        ['f. tronq.']: 'tronquée',
        ['inf.']: 'infixe',
        ['ind.']: 'indéfini',
        ['inf. pres.']: 'infixe présent',
        ['inf. fut']: 'infixe futur',
        ['inf. ref. suj.']: 'infixe référence sujet',
        ['inf. ref. obj.']: 'infixe référence object',
        ['inter.']: 'interrogatif',
        ['interj.']: 'interjection',
        ['inv.']: 'invariable',
        ['idp.']: 'idéophone',
        ['loc.']: 'locution',
        ['m. comp.']: 'mot composé',
        ['n.']: 'nom',
        ['n. masc.']: 'nom masculin',
        ['n. fem.']: 'nom féminin',
        ['n. act.']: 'nom d\'action',
        ['n. comp.']: 'nom composé',
        ['n. prop.']: 'nom propre',
        ['n. pref.']: 'nom préfixé',
        ['n. inf.']: 'nom infixé',
        ['n. suf.']: 'nom suffixé',
        ['ono.']: 'onomatopée',
        ['exp.']: 'expression',
        ['part.']: 'particule',
        ['pos.']: 'possessif',
        ['ppf.']: 'pré-préfixe',
        ['ppf. pers.']: 'pré-préfixe personnel',
        ['ppf. loc. pos.']: 'pré-préfixe locution de position',
        ['ppf. loc. ref.']: 'pré-préfixe locution de réferent',
        ['ppf. loc. int.']: 'pré-préfxe locution interne',
        ['prep.']: 'préposition',
        ['pre. suj.']: 'préfixe sujet',
        ['ppf. obj.']: 'pré-préfixe objet',
        ['pre. suj. aff.']: 'préfixe sujet affirmatif',
        ['pre. suj. imp.']: 'préfixe sujet impératif',
        ['pre. suj. acc.']: 'préfixe sujet accompli',
        ['pre. suj. inn.']: 'préfixe sujet innaccompli',
        ['pre. suj. act.']: 'préfixe sujet actuel',
        ['pre. suj. conn.']: 'préfixe sujet connectif',
        ['pre. suj. neg.']: 'préfixe sujet négatif',
        ['pron.']: 'pronom',
        ['pron. pers.']: 'pronom personnel',
        ['pron. pers. aut.']: 'pronom personnel autonome',
        ['pron. pers. aut. long']: 'pronom personnel autonome long',
        ['pron. pers. red.']: 'pronom personnel redoublé',
        ['pron. pers. disj.']: 'pronom personnel disjoint',
        ['pron. poss.']: 'pronom possessif',
        ['pron. dem.']: 'pronom démonstartif',
        ['pron. dem. prox.']: 'pronom démonstartif de proximité',
        ['pron. dem. ref.']: 'pronom démonstartif de référence',
        ['pron. dem. dist.']: 'pronom démonstartif de distance',
        ['pron. pres.']: 'pronom présentatif',
        ['pron. pres. prox.']: 'pronom présentatif de proximité',
        ['pron. pres. ref.']: 'pronom présentatif. de référence',
        ['pron. pres. dist.']: 'pronom présentatif de distance',
        ['pron. des.']: 'pronom désignatif',
        ['pron. des. prox.']: 'pronom désignatif de proximité',
        ['pron. des. ref.']: 'pronom désignatif de référence',
        ['pron. des. dist.']: 'pronom désignatif de distance',
        ['pron. rel.']: 'pronom relatif',
        ['pron. int.']: 'pronom interrogatif',
        ['qual.']: 'qualificatif',
        ['suf.']: 'suffixe',
        ['suf. loc.']: 'suffixe locatif',
        ['suf. loc. int.']: 'suffixe locatif interne',
        ['suf. loc. pos.']: 'suffixe locatif de position',
        ['v.']: 'verbe',
        ['f. fond.']: 'verbe fondamentale',
        ['f. pass.']: 'verbe fondamentale passive',
        ['f. app.']: 'verbe fondamentale applicative',
        ['f. caus.']: 'verbe fondamentale causative',
        ['f. rec.']: 'verbe fondamentale reciproque',
        ['f. rev.']: 'verbe fondamentale reversive',
        ['f. stat.']: 'verbe fondamentale stative',
        ['f. uni.']: 'verbe fondamentale d\'union',
        ['v. aux']: 'verbe auxiliaire',
        ['v. pron.']: 'verbe pronominal',
        ['v. tra.']: 'verbe transitif',
        ['v. int.']: 'verbe intransitif',
        ['v. imp.']: 'verbe impersonnel',
        ['c. coord.']: 'conjonction de coordination',
    };
}
