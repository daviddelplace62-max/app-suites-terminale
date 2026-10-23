# Suites · Pas à pas

Application pédagogique autonome, en français, pour découvrir et réviser les suites numériques jusqu’aux notions de Terminale spécialité mathématiques. **Aucune installation, aucun compte et aucune dépendance réseau** ne sont nécessaires à son fonctionnement.

## Ce que propose l’application

- **25 étapes, réparties dans 5 modules** : premières définitions et variations ; suites arithmétiques ; suites géométriques ; raisonnement par récurrence ; limites et convergence.
- À chaque étape : une micro-leçon, une formule, un exemple, une illustration et un exercice obligatoire (QCM ou calcul).
- La suite du parcours reste verrouillée jusqu’à une réponse correcte. Une erreur déclenche un indice et peut être corrigée sans limite d’essais. Le retour en arrière reste disponible.
- Profils distincts, reprise du parcours, historique des tentatives et suivi individuel dans le `localStorage` du navigateur.
- 10 points par nouvelle étape validée, sans pénalité en cas d’erreur ; 5 badges et un bilan de fin de parcours. Refaire une étape n’ajoute pas de points.
- Interface responsive, utilisable au clavier, illustrations locales, sans publicité ni outil de suivi.

Le parcours couvre les notions centrales des suites ; il complète le cours et les exercices du professeur, sans prétendre remplacer tous les entraînements de type bac.

## Guide du parent : enregistrer et tester sur un PC

1. Téléchargez l’archive de l’application, puis **décompressez-la** : clic droit → « Extraire tout » sous Windows. N’ouvrez pas simplement le HTML à l’intérieur du ZIP.
2. Dans le dossier extrait, conservez ces quatre fichiers ensemble, sans les renommer :

   ```text
   app-suites-terminale/
   ├── index.html
   ├── styles.css
   ├── lessons.js
   └── app.js
   ```

3. Double-cliquez sur **index.html**. Un navigateur récent suffit : Firefox, Chrome, Edge ou Safari.
4. Créez un profil, par exemple « Ma fille ». Cliquez sur « Commencer le parcours ».
5. Testez une mauvaise réponse : un indice doit apparaître et « Étape suivante » doit rester bloqué. Corrigez-la pour continuer.
6. Rechargez la page, choisissez le même profil et retrouvez vos points. Créez ensuite « Papa » pour vérifier que les deux suivis sont indépendants.

Si votre navigateur refuse la sauvegarde avec un fichier ouvert directement, utilisez le petit serveur local ci-dessous. **Il ne faut pas de serveur pour héberger une base de données** : le serveur sert simplement les fichiers.

### Variante avec un serveur local

Si Python est déjà installé, ouvrez un terminal dans le dossier des quatre fichiers :

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Sous Windows, la commande peut être `py -m http.server 8000 --bind 127.0.0.1` ou `python -m http.server 8000 --bind 127.0.0.1`. Ouvrez ensuite `http://127.0.0.1:8000` dans votre navigateur. Pour arrêter le serveur : `Ctrl+C` dans le terminal.

Dans l’environnement cloud, utilisez le checkout existant `/workspace/app-suites-terminale` ; il n’est pas nécessaire de créer un worktree. Aucun `npm install` ni build n’est nécessaire.

## Partager en quelques minutes avec Netlify Drop

1. Préparez le dossier contenant les quatre fichiers. **index.html doit être directement à sa racine**. Ne glissez ni le ZIP non extrait, ni un dossier parent contenant seulement un autre sous-dossier.
2. Ouvrez **https://app.netlify.com/drop**. Connectez-vous ou créez un compte gratuit si Netlify le demande ; les conditions de son offre peuvent évoluer.
3. Glissez le dossier dans la zone de dépôt et attendez la fin de l’envoi.
4. Netlify affiche une adresse publique en HTTPS, généralement de la forme `https://nom-du-site.netlify.app`. Copiez cette adresse.
5. Ouvrez-la vous-même, créez un profil et vérifiez un exercice. Envoyez ensuite le lien à votre fille par votre messagerie habituelle.
6. Sur son smartphone, elle ouvre le lien et crée son profil. Elle peut ajouter le site à son écran d’accueil depuis le menu de son navigateur.
7. Pour mettre l’application à jour, redéployez les quatre fichiers dans **le même site Netlify**. Conserver le même nom de domaine et le même navigateur permet de conserver l’espace de sauvegarde local.

L’hébergement n’est pas publié automatiquement par ce dépôt ou par les tests. Vous décidez de publier le dossier en le déposant sur Netlify.

## Comprendre la sauvegarde et la confidentialité

- Chaque navigateur et chaque appareil dispose de sa propre progression. Le profil « Ma fille » sur votre PC n’est pas synchronisé avec celui de son téléphone.
- Les profils ne sont pas des comptes sécurisés : toute personne utilisant le même navigateur peut les ouvrir.
- Le mode privé, l’effacement des données du site, un autre navigateur ou un changement d’adresse du site peuvent donner un suivi vide. N’utilisez pas le mode privé pour un suivi durable.
- Les données sont stockées sous la clé `suites-pas-a-pas.v1`. Aucun secret ni identifiant externe n’est demandé. Aucun résultat d’exercice n’est envoyé sur Internet.
- « Mon historique » → « Exporter ma progression » télécharge une archive JSON du profil. Cette version ne propose pas de réimportation ni de synchronisation automatique. Les 500 dernières tentatives sont affichables ; les compteurs et validations sont conservés au-delà.
- Le dossier local fonctionne sans connexion. Pour la version hébergée, une connexion est nécessaire au chargement ; les exercices restent utilisables dans l’onglet chargé sans connexion. Le rechargement hors connexion après fermeture n’est pas garanti : ce n’est pas une application avec service worker.
- En cas d’indisponibilité du stockage, un bandeau avertit que les résultats ne seront conservés que pendant la session.

## Vérifications de développement

L’application n’utilise que les API natives du navigateur. Pour les tests automatisés uniquement : Python, le paquet `playwright` et Chromium sont nécessaires.

```sh
python3 tests/smoke.py
```

Le script lance lui-même un serveur temporaire, utilise `/usr/bin/chromium` par défaut (modifiable avec `SUITES_CHROMIUM`), exécute les scénarios et ferme le navigateur et le serveur. Il vérifie notamment le blocage en cas d’erreur, les profils et la persistance, les 25 étapes et les petits écrans. Les captures de contrôle sont écrites dans le dossier temporaire du système.

Pour installer l’outillage de test sur un autre PC : `python3 -m pip install playwright`, puis `python3 -m playwright install chromium`. Si nécessaire, indiquez le chemin de votre navigateur à `SUITES_CHROMIUM`. Ces outils ne sont pas nécessaires pour utiliser ou partager l’application.

## Accès à votre PC et travail avec GitHub

L’assistant peut modifier et tester le dépôt dans l’espace cloud qui lui est connecté ; il ne peut pas créer de lui-même un accès à votre ordinateur. Ne communiquez pas de mot de passe, de clé privée ou de code de prise en main à distance dans la conversation.

Pour poursuivre les modifications, les revues et les opérations Git, gardez ce dépôt connecté à votre environnement Codex/GitHub et accordez les permissions souhaitées dans l’interface officielle de connexion. Pour travailler sur votre PC, ouvrez ce même dépôt dans votre outil local compatible Codex et autorisez l’accès au dossier du projet via ses réglages. Un accès administrateur à tout le PC n’est pas requis pour cette application. La publication et la fusion d’une pull request sont des opérations distinctes de la création et des tests des fichiers.
