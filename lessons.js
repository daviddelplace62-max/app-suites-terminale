/* Parcours autonome : 25 micro-leçons, chacune suivie d'une validation.
   Les rangs de départ et les hypothèses utiles figurent dans les énoncés. */
window.SUITES_COURSE = {
  modules: [
    {
      id: 'm1', number: 1, title: 'Faire connaissance avec les suites',
      subtitle: 'Des nombres, un rang, une règle.', icon: '✦',
      lessons: [
        {
          id: 'm1l1', title: 'Une suite, c’est quoi ?', eyebrow: 'Les premiers repères',
          objective: 'Associer chaque nombre à son rang.',
          paragraphs: [
            'Une suite numérique est une liste de nombres rangés dans un ordre précis. Chaque nombre est un terme ; sa place est appelée son rang, noté n.',
            'On écrit uₙ pour « le terme de rang n ». Ici, on commence au rang 0 : u₀ est donc le premier terme, u₁ le deuxième et u₃ le quatrième. Certaines suites commencent au rang 1 : lis toujours l’énoncé.'
          ],
          formula: 'Rang n : 0, 1, 2, 3, 4  →  Terme uₙ : 2, 4, 6, 8, 10',
          example: { title: 'Lire sans décaler', text: 'Dans cette liste, u₂ = 6. Le petit 2 indique un rang : ce n’est ni « u multiplié par 2 », ni le deuxième terme.' },
          visual: { type: 'dots', values: [2, 4, 6, 8, 10], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Chaque point correspond à un seul rang.' },
          exercise: { type: 'choice', prompt: 'Pour cette suite, quelle est la valeur de u₃ ?', options: ['6', '8', '10'], answer: 1, hint: 'Commence à u₀ = 2, puis compte trois changements de rang.', explanation: 'u₀ = 2, u₁ = 4, u₂ = 6 et u₃ = 8. Le terme de rang 3 est le quatrième terme.' }
        },
        {
          id: 'm1l2', title: 'Calculer avec une formule explicite', eyebrow: 'Accéder directement à un terme',
          objective: 'Remplacer n par le rang demandé.',
          paragraphs: [
            'Une formule explicite donne uₙ directement à partir de n. Pour calculer un terme, remplace toutes les lettres n par son rang, puis respecte les priorités de calcul.',
            'Avec uₙ = 3n − 2, pour n ≥ 0, on peut calculer u₁₀₀ sans connaître u₉₉. Un terme peut être négatif : u₀ = −2 est bien autorisé.'
          ],
          formula: 'uₙ = 3n − 2  ⇒  u₂ = 3 × 2 − 2 = 4',
          example: { title: 'La bonne substitution', text: 'Pour le rang 3 : u₃ = 3 × 3 − 2 = 7. Le rang est 3 ; la valeur du terme est 7.' },
          visual: { type: 'dots', values: [-2, 1, 4, 7, 10], labels: ['0', '1', '2', '3', '4'], caption: 'Pour chaque rang n, on calcule 3n − 2.' },
          exercise: { type: 'number', prompt: 'On a uₙ = 3n − 2 pour n ≥ 0. Calcule u₄.', answer: 10, hint: 'Remplace n par 4 : calcule d’abord 3 × 4, puis enlève 2.', explanation: 'u₄ = 3 × 4 − 2 = 12 − 2 = 10.' }
        },
        {
          id: 'm1l3', title: 'Avancer par récurrence', eyebrow: 'Un terme après l’autre',
          objective: 'Utiliser une valeur initiale et une règle de passage.',
          paragraphs: [
            'Une définition par récurrence donne un terme initial, puis explique comment passer d’un terme au suivant. uₙ₊₁ désigne le terme qui suit uₙ.',
            'Avec u₀ = 2 et uₙ₊₁ = uₙ + 3, il faut avancer pas à pas : on ajoute 3 à la dernière valeur obtenue. Ne remplace pas uₙ par n : un rang et un terme sont deux choses différentes.'
          ],
          formula: 'u₀ = 2 ; uₙ₊₁ = uₙ + 3  →  2, 5, 8, 11, …',
          example: { title: 'Deux passages', text: 'u₁ = u₀ + 3 = 5, puis u₂ = u₁ + 3 = 8. Chaque nouvelle valeur sert au calcul suivant.' },
          visual: { type: 'steps', values: [2, 5, 8, 11, 14], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'À chaque passage, on ajoute 3.' },
          exercise: { type: 'number', prompt: 'u₀ = 2 et uₙ₊₁ = uₙ + 3. Combien vaut u₃ ?', answer: 11, hint: 'Écris successivement u₁, u₂, puis u₃. Il y a trois additions à partir de u₀.', explanation: 'u₁ = 5, u₂ = 8, puis u₃ = 11.' }
        },
        {
          id: 'm1l4', title: 'Étudier le sens de variation', eyebrow: 'Comparer deux termes voisins',
          objective: 'Distinguer le signe des termes et la variation de la suite.',
          paragraphs: [
            'Une suite est croissante si uₙ₊₁ ≥ uₙ pour tous les rangs considérés ; elle est décroissante si uₙ₊₁ ≤ uₙ. Avec des inégalités strictes à tous les rangs, elle est strictement croissante ou décroissante.',
            'Pour décider, on peut étudier le signe de uₙ₊₁ − uₙ. Attention : avoir des termes positifs ne signifie pas être croissante. Par exemple 5, 4, 3 sont positifs mais diminuent.'
          ],
          formula: 'uₙ = n² ⇒ uₙ₊₁ − uₙ = (n + 1)² − n² = 2n + 1 > 0',
          example: { title: 'Une preuve pour tous les rangs', text: 'Pour n ≥ 0, 2n + 1 est strictement positif. La suite uₙ = n² est donc strictement croissante. Quelques valeurs seules ne suffiraient pas à le prouver.' },
          visual: { type: 'bars', values: [0, 1, 4, 9, 16], labels: ['0', '1', '2', '3', '4'], caption: 'Les carrés augmentent ; le calcul de la différence le démontre.' },
          exercise: { type: 'choice', prompt: 'Si uₙ₊₁ − uₙ = −2 pour tout n ≥ 0, que peut-on conclure ?', options: ['La suite est strictement croissante.', 'La suite est strictement décroissante.', 'Tous les termes sont négatifs.'], answer: 1, hint: 'La différence est négative : chaque nouveau terme est plus petit que le précédent. Cela ne donne pas le signe des termes.', explanation: 'uₙ₊₁ − uₙ < 0 équivaut à uₙ₊₁ < uₙ. La suite est strictement décroissante, quel que soit le signe de ses termes.' }
        },
        {
          id: 'm1l5', title: 'Traduire une situation en suite', eyebrow: 'Du texte aux mathématiques',
          objective: 'Choisir un rang initial et écrire une règle adaptée.',
          paragraphs: [
            'Pour modéliser une situation, précise ce que représente uₙ, l’unité et le moment du premier terme. Le rang n compte souvent des jours, des mois ou des années écoulés.',
            'Un réservoir contient 100 litres au départ. On ajoute 20 litres chaque jour, sans perte : uₙ est le volume après n jours, donc u₀ = 100. « Ajouter 20 » donne une addition, pas une multiplication.'
          ],
          formula: 'u₀ = 100 ; uₙ₊₁ = uₙ + 20 ; uₙ = 100 + 20n',
          example: { title: 'Deux écritures, une même suite', text: 'Après 3 jours : u₃ = 100 + 20 × 3 = 160 litres. On retrouve 100 → 120 → 140 → 160 avec la règle de récurrence.' },
          visual: { type: 'bars', values: [100, 120, 140, 160, 180], labels: ['Départ', 'Jour 1', 'Jour 2', 'Jour 3', 'Jour 4'], caption: 'n compte les jours écoulés depuis le volume initial.' },
          exercise: { type: 'choice', prompt: 'Quelle règle correspond à « on ajoute 20 litres chaque jour » ?', options: ['uₙ₊₁ = 20 × uₙ', 'uₙ₊₁ = uₙ + 20', 'uₙ₊₁ = n + 20'], answer: 1, hint: 'Le nouveau volume est le volume précédent augmenté de 20 litres.', explanation: 'La règle est uₙ₊₁ = uₙ + 20. Une multiplication par 20 décrirait une tout autre évolution.' }
        }
      ]
    },
    {
      id: 'm2', number: 2, title: 'Les suites arithmétiques',
      subtitle: 'Ajouter toujours la même quantité.', icon: '+',
      lessons: [
        {
          id: 'm2l1', title: 'Reconnaître une raison constante', eyebrow: 'Le même écart à chaque rang',
          objective: 'Identifier une suite arithmétique et sa raison r.',
          paragraphs: [
            'Une suite est arithmétique lorsque l’on ajoute toujours le même nombre r pour passer au terme suivant. Ce nombre est appelé la raison.',
            'La définition est uₙ₊₁ = uₙ + r pour tous les rangs. Pour identifier une raison à partir de valeurs, calcule les différences entre termes voisins. Quelques valeurs peuvent suggérer une règle ; il faut la justifier pour tous les rangs si la suite n’est pas donnée comme arithmétique.'
          ],
          formula: 'uₙ₊₁ = uₙ + r  ⇔  uₙ₊₁ − uₙ = r',
          example: { title: 'Un écart de 3', text: 'La suite définie par u₀ = 4 et uₙ₊₁ = uₙ + 3 est arithmétique de raison 3. Ses premiers termes sont 4, 7, 10, 13.' },
          visual: { type: 'steps', values: [4, 7, 10, 13, 16], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Une même addition : +3.' },
          exercise: { type: 'number', prompt: 'Une suite est arithmétique, avec u₂ = 10 et u₃ = 13. Quelle est sa raison ?', answer: 3, hint: 'La raison est le terme suivant moins le terme précédent : u₃ − u₂.', explanation: 'r = u₃ − u₂ = 13 − 10 = 3.' }
        },
        {
          id: 'm2l2', title: 'Trouver un terme éloigné', eyebrow: 'Compter les changements de rang',
          objective: 'Utiliser la formule explicite à partir de n’importe quel rang connu.',
          paragraphs: [
            'Pour avancer de p à n, on effectue n − p passages. Dans une suite arithmétique, chacun ajoute r : on ajoute donc (n − p)r au terme uₚ.',
            'Depuis le rang 0, on obtient uₙ = u₀ + nr. Depuis le rang 1, c’est uₙ = u₁ + (n − 1)r. L’erreur classique est d’oublier le rang de départ.'
          ],
          formula: 'uₙ = uₚ + (n − p)r',
          example: { title: 'Partir du rang 3', text: 'Si u₃ = 11 et r = −2, alors u₅ = 11 + (5 − 3) × (−2) = 7. Il y a deux passages, pas cinq.' },
          visual: { type: 'steps', values: [11, 9, 7, 5, 3], labels: ['u₃', 'u₄', 'u₅', 'u₆', 'u₇'], caption: 'Quatre passages séparent les rangs 3 et 7.' },
          exercise: { type: 'number', prompt: 'Une suite arithmétique a pour raison −2 et u₃ = 11. Calcule u₇.', answer: 3, hint: 'De 3 à 7, il y a 7 − 3 = 4 passages. Calcule 11 + 4 × (−2).', explanation: 'u₇ = u₃ + (7 − 3)r = 11 − 8 = 3.' }
        },
        {
          id: 'm2l3', title: 'Lire la variation dans la raison', eyebrow: 'Le signe de r décide',
          objective: 'Déterminer le sens de variation d’une suite arithmétique.',
          paragraphs: [
            'Pour une suite arithmétique, uₙ₊₁ − uₙ = r. Si r > 0, la suite est strictement croissante ; si r < 0, elle est strictement décroissante ; si r = 0, elle est constante.',
            'Le signe du premier terme ne change pas cette conclusion. Une suite peut commencer positive, décroître et finir par devenir négative.'
          ],
          formula: 'r > 0 : ↗  ;  r = 0 : →  ;  r < 0 : ↘',
          example: { title: 'Diminuer de 1,5', text: 'Avec u₀ = 6 et r = −1,5, les premiers termes sont 6 ; 4,5 ; 3 ; 1,5 ; 0. La suite est strictement décroissante.' },
          visual: { type: 'dots', values: [6, 4.5, 3, 1.5, 0, -1.5], labels: ['0', '1', '2', '3', '4', '5'], caption: 'La suite continue à diminuer après avoir atteint 0.' },
          exercise: { type: 'choice', prompt: 'Une suite arithmétique vérifie u₀ = −10 et r = 2. Elle est…', options: ['strictement décroissante, car u₀ < 0.', 'constante, car la raison est fixe.', 'strictement croissante, car r > 0.'], answer: 2, hint: 'C’est le signe de la raison qui indique la variation, pas le signe de u₀.', explanation: 'r = 2 > 0 : chaque terme dépasse le précédent de 2. La suite est strictement croissante.' }
        },
        {
          id: 'm2l4', title: 'Additionner des termes consécutifs', eyebrow: 'Compter avant de calculer',
          objective: 'Calculer une somme arithmétique sans erreur de nombre de termes.',
          paragraphs: [
            'La somme de termes consécutifs d’une suite arithmétique vaut : nombre de termes × moyenne du premier et du dernier terme.',
            'De uₚ à uₙ inclus, il y a n − p + 1 termes. De u₀ à uₙ inclus, il y en a n + 1. Les deux bornes comptent !'
          ],
          formula: 'uₚ + ⋯ + uₙ = (n − p + 1) × (uₚ + uₙ) / 2',
          example: { title: 'Des paires de même somme', text: 'Pour 2 + 5 + 8 + 11 + 14, la moyenne des extrêmes est (2 + 14)/2 = 8. Les cinq termes ont pour somme 5 × 8 = 40.' },
          visual: { type: 'bars', values: [2, 5, 8, 11, 14], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Du rang 0 au rang 4 inclus : 5 termes.' },
          exercise: { type: 'number', prompt: 'Calcule u₀ + u₁ + u₂ + u₃ + u₄ pour u₀ = 2 et r = 3.', answer: 40, hint: 'u₄ = 14. Il y a 5 termes : calcule 5 × (2 + 14) / 2.', explanation: 'La somme vaut 5 × (2 + 14)/2 = 40. On peut vérifier : 2 + 5 + 8 + 11 + 14 = 40.' }
        },
        {
          id: 'm2l5', title: 'Modéliser une épargne régulière', eyebrow: 'Distinguer un versement et un total',
          objective: 'Passer d’une évolution arithmétique à une somme.',
          paragraphs: [
            'Lina verse 30 € le premier mois, puis augmente chaque versement de 5 €. On note vₙ le versement du mois n : ici, le premier rang est 1.',
            'La suite des versements est arithmétique : v₁ = 30 et vₙ = 30 + 5(n − 1). Le total épargné sur plusieurs mois est la somme des versements, et non le dernier versement.'
          ],
          formula: 'v₆ = 55 € ; total sur 6 mois = 6 × (v₁ + v₆) / 2',
          example: { title: 'Un mois ou plusieurs mois ?', text: 'Au troisième mois, le versement est v₃ = 40 €. Le total des trois premiers mois est 30 + 35 + 40 = 105 €.' },
          visual: { type: 'bars', values: [30, 35, 40, 45, 50, 55], labels: ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6'], caption: 'Les barres montrent les versements de chaque mois, pas le total.' },
          exercise: { type: 'number', prompt: 'Quel est le total épargné pendant les 6 premiers mois ?', answer: 255, unit: '€', hint: 'Il y a 6 versements. Le premier vaut 30 €, le dernier 55 € : utilise la formule de somme.', explanation: 'Le total vaut 6 × (30 + 55)/2 = 3 × 85 = 255 €.' }
        }
      ]
    },
    {
      id: 'm3', number: 3, title: 'Les suites géométriques',
      subtitle: 'Multiplier par un même nombre.', icon: '×',
      lessons: [
        {
          id: 'm3l1', title: 'Reconnaître un multiplicateur constant', eyebrow: 'La raison géométrique',
          objective: 'Distinguer une multiplication répétée d’une addition répétée.',
          paragraphs: [
            'Une suite est géométrique lorsqu’on multiplie toujours par le même nombre q pour passer au terme suivant. Sa définition est uₙ₊₁ = q × uₙ.',
            'Quand uₙ ≠ 0, le quotient uₙ₊₁ / uₙ vaut q. Une suite n’est pas géométrique simplement parce que ses valeurs augmentent : c’est le multiplicateur constant qui compte.'
          ],
          formula: 'uₙ₊₁ = q × uₙ',
          example: { title: 'Doubler à chaque étape', text: 'u₀ = 3 et uₙ₊₁ = 2uₙ donnent 3, 6, 12, 24… La raison est q = 2. Les différences, elles, ne sont pas constantes.' },
          visual: { type: 'bars', values: [3, 6, 12, 24], labels: ['u₀', 'u₁', 'u₂', 'u₃'], caption: 'Chaque valeur est multipliée par 2.' },
          exercise: { type: 'number', prompt: 'u₀ = 3 et uₙ₊₁ = 2uₙ. Calcule u₃.', answer: 24, hint: 'Pars de 3, puis multiplie trois fois par 2 : 3 → 6 → 12 → …', explanation: 'u₁ = 6, u₂ = 12 et u₃ = 24.' }
        },
        {
          id: 'm3l2', title: 'Utiliser une puissance', eyebrow: 'Accéder directement à un rang',
          objective: 'Calculer un terme géométrique en comptant les multiplications.',
          paragraphs: [
            'Après n passages depuis u₀, on a multiplié n fois par q. Pour n ≥ 1, uₙ = u₀ × qⁿ. Si q ≠ 0, cette formule s’utilise aussi au rang 0 car q⁰ = 1.',
            'Depuis un rang p connu et avec q ≠ 0, on peut écrire uₙ = uₚ × q^(n − p). Ne confonds pas qⁿ avec n × q : une puissance est une multiplication répétée.'
          ],
          formula: 'uₙ = u₀ × qⁿ (n ≥ 1) ; uₙ = uₚ × q^(n − p) si q ≠ 0',
          example: { title: 'Diviser par deux', text: 'Pour u₀ = 80 et q = 0,5, u₂ = 80 × 0,5² = 20. Le carré porte sur la raison, pas sur 80.' },
          visual: { type: 'dots', values: [80, 40, 20, 10, 5], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Multiplier par 0,5 revient à diviser par 2.' },
          exercise: { type: 'number', prompt: 'Une suite géométrique a u₀ = 80 et q = 0,5. Calcule u₃.', answer: 10, hint: 'Calcule 80 × 0,5³, ou divise 80 par 2 trois fois.', explanation: 'u₃ = 80 × 0,125 = 10.' }
        },
        {
          id: 'm3l3', title: 'Raison, signe et variation', eyebrow: 'Toujours préciser les hypothèses',
          objective: 'Comprendre les effets de q, notamment quand il est négatif.',
          paragraphs: [
            'Si u₀ > 0 : pour q > 1, la suite est strictement croissante ; pour 0 < q < 1, elle est strictement décroissante ; pour q = 1, elle est constante. Avec u₀ < 0 et q > 0, les sens de variation s’inversent.',
            'Si q < 0 et u₀ ≠ 0, les signes alternent : la suite n’est pas monotone. Si q = 0, tous les termes à partir de u₁ sont nuls. Si u₀ = 0, toute la suite est nulle, quelle que soit q.'
          ],
          formula: 'uₙ₊₁ − uₙ = (q − 1)uₙ',
          example: { title: 'Alterner tout en se rapprochant de 0', text: 'Avec u₀ = 4 et q = −0,5 : 4 ; −2 ; 1 ; −0,5 ; 0,25… Les signes alternent. La suite n’est ni croissante ni décroissante.' },
          visual: { type: 'dots', values: [4, -2, 1, -0.5, 0.25], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Une raison négative change le signe à chaque passage.' },
          exercise: { type: 'choice', prompt: 'Pour u₀ = 4 et q = −0,5, quelle affirmation est vraie ?', options: ['La suite est strictement décroissante.', 'Les signes alternent et la suite n’est pas monotone.', 'Tous les termes sont négatifs.'], answer: 1, hint: 'Compare 4 à −2, puis −2 à 1 : le sens de variation change.', explanation: 'Les termes passent alternativement de part et d’autre de 0. On ne peut donc pas qualifier la suite de croissante ou de décroissante.' }
        },
        {
          id: 'm3l4', title: 'Additionner une suite géométrique', eyebrow: 'Une formule, un nombre de termes',
          objective: 'Calculer une somme géométrique finie.',
          paragraphs: [
            'Pour q ≠ 1, la somme 1 + q + q² + ⋯ + qⁿ vaut (1 − q^(n + 1))/(1 − q). Le dernier exposant est n, mais il y a n + 1 termes.',
            'Pour une suite géométrique, multiplie cette somme par u₀. Si q = 1, chaque terme vaut u₀ : la somme vaut simplement (n + 1)u₀. On ne divise jamais par 1 − q lorsque q = 1.'
          ],
          formula: 'u₀ + ⋯ + uₙ = u₀ × (1 − q^(n + 1)) / (1 − q), si q ≠ 1',
          example: { title: 'Quatre termes, puissance 4', text: 'Avec u₀ = 2 et q = 3 : u₀ + u₁ + u₂ + u₃ = 2 × (1 − 3⁴)/(1 − 3). Les deux nombres au numérateur et au dénominateur sont négatifs : leur quotient est positif.' },
          visual: { type: 'bars', values: [2, 6, 18, 54], labels: ['u₀', 'u₁', 'u₂', 'u₃'], caption: 'Quatre termes : 2, 6, 18 et 54.' },
          exercise: { type: 'number', prompt: 'Calcule u₀ + u₁ + u₂ + u₃ pour u₀ = 2 et q = 3.', answer: 80, hint: 'Tu peux additionner 2 + 6 + 18 + 54 ou calculer 2 × (1 − 81)/(1 − 3).', explanation: '2 × (−80)/(−2) = 80. Vérification directe : 2 + 6 + 18 + 54 = 80.' }
        },
        {
          id: 'm3l5', title: 'Traduire un pourcentage', eyebrow: 'Le coefficient multiplicateur',
          objective: 'Modéliser des évolutions successives en pourcentage.',
          paragraphs: [
            'Augmenter une quantité de t % revient à la multiplier par 1 + t/100. La diminuer de t % revient à la multiplier par 1 − t/100.',
            'Si le même taux s’applique à chaque période, on obtient une suite géométrique. Une baisse de 10 % se calcule sur la nouvelle valeur à chaque fois : deux baisses de 10 % ne font pas une baisse de 20 %.'
          ],
          formula: '−10 %  →  q = 0,90 ; uₙ = 200 × 0,9ⁿ',
          example: { title: 'Une valeur qui baisse', text: 'Un objet vaut 200 € au départ et perd 10 % de sa valeur chaque année. Après un an : 200 × 0,9 = 180 €. Après deux ans, on enlève 10 % de 180 €, pas de 200 €.' },
          visual: { type: 'bars', values: [200, 180, 162, 145.8], labels: ['Départ', '1 an', '2 ans', '3 ans'], caption: 'Le taux est constant ; la baisse en euros ne l’est pas.' },
          exercise: { type: 'number', prompt: 'Quelle est la valeur de cet objet après deux ans ?', answer: 162, unit: '€', hint: 'Le coefficient est 0,9. Calcule 200 × 0,9 × 0,9.', explanation: 'u₂ = 200 × 0,9² = 200 × 0,81 = 162 €. La baisse totale est de 19 %.' }
        }
      ]
    },
    {
      id: 'm4', number: 4, title: 'Raisonner par récurrence',
      subtitle: 'Prouver une propriété à tous les rangs.', icon: '↗',
      lessons: [
        {
          id: 'm4l1', title: 'Comprendre le principe des dominos', eyebrow: 'Deux vérifications indispensables',
          objective: 'Identifier l’initialisation et l’hérédité.',
          paragraphs: [
            'Une propriété P(n) dépend d’un entier n. Pour la prouver pour tout n ≥ n₀, une récurrence comporte deux étapes : vérifier P(n₀), puis démontrer que P(n) entraîne P(n + 1).',
            'Comme des dominos : le premier doit tomber, et chaque domino doit entraîner le suivant. Vérifier seulement quelques rangs n’est pas une preuve ; une hérédité sans initialisation ne suffit pas non plus.'
          ],
          formula: 'P(n₀) vraie et [P(n) ⇒ P(n + 1)]  ⇒  P(n) vraie pour tout n ≥ n₀',
          example: { title: 'Choisir le bon premier rang', text: 'Si la propriété doit être vraie à partir du rang 1, on commence par vérifier P(1). On ne vérifie P(0) que si ce rang appartient au domaine visé.' },
          visual: { type: 'steps', values: [1, 2, 3, 4, 5], labels: ['P(n₀)', 'P(n₀+1)', 'P(n₀+2)', '…', 'Tous'], caption: 'Un départ vérifié, puis une transmission valable à chaque rang.' },
          exercise: { type: 'choice', prompt: 'Pour démontrer P(n) pour tout n ≥ 0 par récurrence, que faut-il faire ?', options: ['Vérifier seulement P(0), P(1) et P(2).', 'Vérifier P(0), puis prouver que P(n) implique P(n + 1).', 'Supposer directement P(n + 1) vraie.'], answer: 1, hint: 'Il faut à la fois un point de départ et une règle de transmission valable pour un entier quelconque.', explanation: 'L’initialisation lance la preuve ; l’hérédité permet de passer d’un rang quelconque au suivant. Ensemble, elles couvrent tous les entiers n ≥ 0.' }
        },
        {
          id: 'm4l2', title: 'Réussir l’initialisation', eyebrow: 'Vérifier la formule au premier rang',
          objective: 'Comparer la valeur initiale et la propriété annoncée.',
          paragraphs: [
            'On considère u₀ = 1 et uₙ₊₁ = 2uₙ + 1. On veut prouver P(n) : « uₙ = 2^(n + 1) − 1 » pour tout n ≥ 0.',
            'Initialiser consiste à calculer les deux côtés au rang 0. On sait u₀ = 1 ; la formule donne 2^(0 + 1) − 1 = 1. Les valeurs sont égales : P(0) est vraie.'
          ],
          formula: 'Au rang 0 : u₀ = 1 et 2¹ − 1 = 1',
          example: { title: 'L’initialisation ne fait pas tout', text: 'La formule fonctionne au rang 0. Il reste à démontrer qu’elle se transmet d’un rang au suivant : c’est la prochaine étape.' },
          visual: { type: 'dots', values: [1, 3, 7, 15], labels: ['u₀', 'u₁', 'u₂', 'u₃'], caption: 'Les premières valeurs suggèrent la formule, sans encore la prouver.' },
          exercise: { type: 'number', prompt: 'Quelle valeur donne 2^(n + 1) − 1 lorsque n = 0 ?', answer: 1, hint: 'Calcule 2^(0 + 1) − 1. Attention : 2¹ vaut 2.', explanation: '2^(0 + 1) − 1 = 2¹ − 1 = 1, ce qui correspond bien à u₀.' }
        },
        {
          id: 'm4l3', title: 'Démontrer l’hérédité', eyebrow: 'Utiliser l’hypothèse au bon rang',
          objective: 'Passer d’une formule au rang n à sa version au rang n + 1.',
          paragraphs: [
            'Fixons un entier n ≥ 0 et supposons P(n) vraie : uₙ = 2^(n + 1) − 1. C’est l’hypothèse de récurrence. Elle est supposée uniquement pour ce rang, pendant cette étape.',
            'On part de la règle connue uₙ₊₁ = 2uₙ + 1, puis on remplace uₙ grâce à l’hypothèse. On obtient uₙ₊₁ = 2^(n + 2) − 1 : c’est exactement P(n + 1). Avec l’initialisation précédente, on peut conclure pour tout n ≥ 0.'
          ],
          formula: 'uₙ₊₁ = 2[2^(n + 1) − 1] + 1 = 2^(n + 2) − 1',
          example: { title: 'Le décalage dans l’exposant', text: 'P(n + 1) s’écrit uₙ₊₁ = 2^((n + 1) + 1) − 1. L’exposant devient donc n + 2, et non n + 1.' },
          visual: { type: 'steps', values: [1, 3, 7, 15, 31], labels: ['n = 0', 'n = 1', 'n = 2', 'n = 3', 'n = 4'], caption: 'La même règle ×2 puis +1 transmet la formule.' },
          exercise: { type: 'choice', prompt: 'En utilisant uₙ = 2^(n + 1) − 1, quelle expression obtient-on pour uₙ₊₁ ?', options: ['2^(n + 2) − 1', '2^(n + 1) − 1', '2^(n + 2) + 1'], answer: 0, hint: 'Développe 2[2^(n + 1) − 1] + 1 : le facteur 2 augmente l’exposant de 1 et −2 + 1 vaut −1.', explanation: '2 × 2^(n + 1) − 2 + 1 = 2^(n + 2) − 1. On a bien démontré P(n + 1) à partir de P(n).' }
        },
        {
          id: 'm4l4', title: 'Prouver qu’une suite est bornée', eyebrow: 'Une récurrence avec des inégalités',
          objective: 'Transmettre un encadrement grâce à une fonction croissante.',
          paragraphs: [
            'On définit u₀ = 0 et uₙ₊₁ = √(2 + uₙ). Montrons par récurrence que 0 ≤ uₙ ≤ 2. Initialisation : 0 ≤ u₀ = 0 ≤ 2.',
            'Hérédité : si 0 ≤ uₙ ≤ 2, alors 2 ≤ 2 + uₙ ≤ 4. La racine carrée est définie et croissante sur [0 ; +∞[ : √2 ≤ uₙ₊₁ ≤ 2, donc 0 ≤ uₙ₊₁ ≤ 2. L’encadrement est transmis et la suite est bien définie à tous les rangs.',
            'Conclusion : pour tout n ≥ 0, la suite est minorée par 0 et majorée par 2 ; on dit qu’elle est bornée. Cela ne prouve pas encore à lui seul qu’elle converge.'
          ],
          formula: '0 ≤ uₙ ≤ 2  ⇒  √2 ≤ √(2 + uₙ) ≤ 2  ⇒  0 ≤ uₙ₊₁ ≤ 2',
          example: { title: 'Pourquoi la racine conserve l’ordre', text: 'Lorsque 0 ≤ a ≤ b, on a √a ≤ √b. Ici 2 + uₙ ≤ 4 donne √(2 + uₙ) ≤ √4 = 2.' },
          visual: { type: 'curve', values: [0, Math.sqrt(2), Math.sqrt(2 + Math.sqrt(2)), Math.sqrt(2 + Math.sqrt(2 + Math.sqrt(2))), Math.sqrt(2 + Math.sqrt(2 + Math.sqrt(2 + Math.sqrt(2))))], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], bound: 2, caption: 'Les cinq points sont les termes u₀ à u₄. La ligne pointillée à 2 marque leur borne supérieure.' },
          exercise: { type: 'number', prompt: 'Si 0 ≤ uₙ ≤ 2, quelle borne supérieure obtient-on pour √(2 + uₙ) ?', answer: 2, hint: 'On a 2 + uₙ ≤ 4. Applique la racine carrée : √4 vaut combien ?', explanation: '√(2 + uₙ) ≤ √4 = 2. La borne supérieure 2 est conservée d’un rang au suivant.' }
        },
        {
          id: 'm4l5', title: 'Prouver la croissance par récurrence', eyebrow: 'Assembler une preuve complète',
          objective: 'Rédiger initialisation, hérédité et conclusion.',
          paragraphs: [
            'Reprenons u₀ = 0 et uₙ₊₁ = √(2 + uₙ), dont les termes sont bien définis. Pour prouver la croissance, posons P(n) : « uₙ ≤ uₙ₊₁ ». Initialisation : u₀ = 0 ≤ √2 = u₁.',
            'Hérédité : supposons uₙ ≤ uₙ₊₁. La fonction f(x) = √(2 + x) est croissante sur [0 ; 2], où se trouvent les termes. Donc f(uₙ) ≤ f(uₙ₊₁), soit uₙ₊₁ ≤ uₙ₊₂.',
            'Conclusion : par récurrence, uₙ ≤ uₙ₊₁ pour tout n ≥ 0. La suite est croissante. La majoration démontrée précédemment sera utile pour étudier sa limite.'
          ],
          formula: 'uₙ ≤ uₙ₊₁  ⇒  f(uₙ) ≤ f(uₙ₊₁)  ⇒  uₙ₊₁ ≤ uₙ₊₂',
          example: { title: 'Ne pas supposer la conclusion', text: 'Dans l’hérédité, on suppose seulement uₙ ≤ uₙ₊₁. On démontre ensuite l’inégalité au rang suivant ; on ne l’utilise pas avant de l’avoir prouvée.' },
          visual: { type: 'curve', values: [0, 1.4142135624, 1.847759065, 1.961570561, 1.990369453], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄'], caption: 'Les valeurs illustrent la croissance ; la récurrence la prouve pour tous les rangs.' },
          exercise: { type: 'choice', prompt: 'Pourquoi uₙ ≤ uₙ₊₁ entraîne-t-il f(uₙ) ≤ f(uₙ₊₁) ici ?', options: ['Parce que toute fonction conserve les inégalités.', 'Parce que f est croissante sur l’intervalle contenant les termes.', 'Parce que les deux termes sont nécessairement égaux.'], answer: 1, hint: 'Une fonction décroissante inverserait l’ordre. Il faut identifier la propriété de f qui conserve l’ordre.', explanation: 'La croissance de f sur [0 ; 2] conserve les inégalités. Les termes appartiennent bien à cet intervalle grâce à l’encadrement précédent.' }
        }
      ]
    },
    {
      id: 'm5', number: 5, title: 'Limites et convergence',
      subtitle: 'Comprendre ce qui se passe à l’infini.', icon: '∞',
      lessons: [
        {
          id: 'm5l1', title: 'Se rapprocher d’une limite finie', eyebrow: 'Aussi près que l’on veut, à partir d’un certain rang',
          objective: 'Comprendre la convergence et reconnaître des limites usuelles.',
          paragraphs: [
            'Une suite converge vers ℓ lorsque ses termes restent aussi proches de ℓ qu’on le souhaite à partir d’un certain rang. Elle n’a pas besoin d’atteindre ℓ et n’a pas besoin d’être monotone.',
            'Quand n tend vers +∞, 1/n et 1/n² tendent vers 0 (pour n ≥ 1). Si −1 < q < 1, alors qⁿ tend vers 0. Pour q = 1, qⁿ vaut toujours 1 ; pour q = 0, les termes qⁿ sont nuls dès n ≥ 1.'
          ],
          formula: 'uₙ → ℓ signifie : |uₙ − ℓ| devient puis reste arbitrairement petit.',
          example: { title: 'Une approche sans arrivée', text: 'Pour uₙ = 1/n, tous les termes sont strictement positifs, mais la limite est 0. Par exemple, dès que n > 100, on a 0 < uₙ < 0,01.' },
          visual: { type: 'curve', values: [1, 0.5, 0.25, 0.125, 0.0625], labels: ['n = 1', 'n = 2', 'n = 4', 'n = 8', 'n = 16'], caption: 'Quelques termes de 1/n : les rangs affichés ne sont pas consécutifs.' },
          exercise: { type: 'number', prompt: 'Quelle est la limite de uₙ = 5 × (−0,5)ⁿ lorsque n tend vers +∞ ?', answer: 0, hint: 'La raison −0,5 est comprise strictement entre −1 et 1. Sa puissance tend vers 0, même si les signes alternent.', explanation: '(−0,5)ⁿ tend vers 0 car |−0,5| < 1. Multiplier par 5 conserve la limite 0.' }
        },
        {
          id: 'm5l2', title: 'Diverger et reconnaître les oscillations', eyebrow: 'Toutes les suites ne convergent pas',
          objective: 'Distinguer limite infinie et absence de limite.',
          paragraphs: [
            'Dire que uₙ tend vers +∞ signifie qu’à partir d’un certain rang, tous les termes dépassent n’importe quel seuil fixé. Les suites n, n² et √n tendent vers +∞. Pour une suite arithmétique de raison r > 0, c’est aussi le cas ; si r < 0, elle tend vers −∞.',
            'Si q > 1 et u₀ > 0, alors u₀qⁿ tend vers +∞ (vers −∞ si u₀ < 0). Une suite peut aussi n’avoir aucune limite : avec q = −1 et u₀ ≠ 0, les termes alternent entre deux valeurs ; avec q < −1 et u₀ ≠ 0, ils alternent avec une amplitude croissante.'
          ],
          formula: 'n → +∞ ; 2ⁿ → +∞ ; (−1)ⁿ : aucune limite',
          example: { title: 'Être bornée ne suffit pas', text: 'La suite (−1)ⁿ reste entre −1 et 1, mais elle alterne toujours entre ces deux valeurs. Elle n’a ni limite finie, ni limite +∞ ou −∞.' },
          visual: { type: 'dots', values: [1, -1, 1, -1, 1, -1], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄', 'u₅'], caption: 'Les termes n’approchent pas une seule valeur.' },
          exercise: { type: 'choice', prompt: 'Quelle affirmation décrit correctement uₙ = (−1)ⁿ ?', options: ['Elle converge vers 0 car elle est bornée.', 'Elle tend vers +∞.', 'Elle n’a aucune limite.'], answer: 2, hint: 'Les rangs pairs donnent toujours 1 et les rangs impairs toujours −1. Ces deux valeurs ne se rapprochent pas.', explanation: 'La suite reste bornée mais oscille entre deux valeurs distinctes. Elle n’a aucune limite.' }
        },
        {
          id: 'm5l3', title: 'Calculer une limite sans piège', eyebrow: 'Opérations et formes indéterminées',
          objective: 'Reconnaître une forme indéterminée et transformer l’expression.',
          paragraphs: [
            'Si uₙ → a et vₙ → b avec a et b réels, alors uₙ + vₙ → a + b et uₙvₙ → ab. Pour un quotient, il faut b ≠ 0 : alors uₙ/vₙ → a/b.',
            'Les écritures +∞ − ∞, 0 × ∞, ∞/∞ et 0/0 sont des formes indéterminées : elles ne donnent pas une réponse. Il faut transformer l’expression, par exemple en factorisant ou en divisant par la puissance de n dominante.'
          ],
          formula: '(3n + 1)/(n + 2) = (3 + 1/n)/(1 + 2/n) → 3/1',
          example: { title: 'Lever une forme ∞/∞', text: 'Pour n ≥ 1, on divise le numérateur et le dénominateur par n. Comme 1/n → 0 et 2/n → 0, le nouveau dénominateur tend vers 1, qui est non nul : on peut appliquer la règle du quotient.' },
          visual: { type: 'curve', values: [4 / 3, 7 / 4, 16 / 7, 31 / 12, 301 / 102], labels: ['n = 1', 'n = 2', 'n = 5', 'n = 10', 'n = 100'], caption: 'Les valeurs de (3n + 1)/(n + 2) se rapprochent de 3.' },
          exercise: { type: 'number', prompt: 'Quelle est la limite de (3n + 1)/(n + 2) lorsque n tend vers +∞ ?', answer: 3, hint: 'Divise en haut et en bas par n : (3 + 1/n)/(1 + 2/n). Les termes 1/n et 2/n tendent vers 0.', explanation: 'La limite est (3 + 0)/(1 + 0) = 3. La forme initiale ∞/∞ ne permettait pas de conclure directement.' }
        },
        {
          id: 'm5l4', title: 'Encadrer pour trouver une limite', eyebrow: 'Gendarmes et comparaison',
          objective: 'Choisir le bon théorème pour contrôler une suite.',
          paragraphs: [
            'Théorème des gendarmes : si aₙ ≤ uₙ ≤ bₙ à partir d’un certain rang, et si aₙ et bₙ tendent vers le même réel ℓ, alors uₙ tend vers ℓ.',
            'Comparaison avec l’infini : si uₙ ≥ vₙ à partir d’un certain rang et vₙ → +∞, alors uₙ → +∞. De même, si uₙ ≤ vₙ et vₙ → −∞, alors uₙ → −∞. Une simple borne constante ne donne pas une limite.'
          ],
          formula: '2 − 1/n ≤ uₙ ≤ 2 + 1/n  ⇒  uₙ → 2',
          example: { title: 'Deux bords qui se rejoignent', text: 'Pour n ≥ 1, 2 − 1/n → 2 et 2 + 1/n → 2. Toute suite située entre ces deux bornes converge vers 2, même si elle oscille. Par exemple uₙ = 2 + (−1)ⁿ/n.' },
          visual: { type: 'comparison', values: [1, 2.5, 5 / 3, 2.25, 1.8, 13 / 6, 13 / 7, 2.125], lower: [1, 1.5, 5 / 3, 1.75, 1.8, 11 / 6, 13 / 7, 1.875], upper: [3, 2.5, 7 / 3, 2.25, 2.2, 13 / 6, 15 / 7, 2.125], labels: ['n = 1', 'n = 2', 'n = 3', 'n = 4', 'n = 5', 'n = 6', 'n = 7', 'n = 8'], bound: 2, caption: 'La suite uₙ = 2 + (−1)ⁿ/n oscille entre la borne basse 2 − 1/n et la borne haute 2 + 1/n. Les deux bornes se rejoignent vers la ligne pointillée à 2.' },
          exercise: { type: 'number', prompt: 'Pour tout n ≥ 1, 2 − 1/n ≤ uₙ ≤ 2 + 1/n. Quelle est la limite de uₙ ?', answer: 2, hint: 'Calcule la limite des deux bornes. Le théorème des gendarmes s’applique si elles ont la même limite.', explanation: 'Les deux bornes tendent vers 2. Le théorème des gendarmes donne donc uₙ → 2.' }
        },
        {
          id: 'm5l5', title: 'Conclure sur une suite récurrente', eyebrow: 'Existence d’abord, valeur ensuite',
          objective: 'Utiliser le théorème de convergence monotone puis une équation de limite.',
          paragraphs: [
            'Théorème de convergence monotone : une suite croissante et majorée converge vers un réel ; une suite décroissante et minorée aussi. Attention : sa limite n’est pas forcément égale à une borne choisie. Une suite croissante non majorée tend vers +∞.',
            'Pour u₀ = 0 et uₙ₊₁ = √(2 + uₙ), nous avons prouvé que la suite est croissante et reste dans [0 ; 2]. Elle converge donc vers un réel ℓ de cet intervalle.',
            'La fonction x ↦ √(2 + x) est continue sur [0 ; 2]. En passant à la limite dans la récurrence : ℓ = √(2 + ℓ), donc ℓ² − ℓ − 2 = 0. Les solutions sont 2 et −1 ; comme ℓ ≥ 0, seule 2 convient. Résoudre une équation de point fixe sans prouver la convergence ne suffirait pas.'
          ],
          formula: 'Croissante + majorée ⇒ convergence ; (ℓ − 2)(ℓ + 1) = 0 et ℓ ≥ 0 ⇒ ℓ = 2',
          example: { title: 'La chaîne complète de justification', text: '1. Encadrer par récurrence. 2. Prouver la croissance. 3. Déduire l’existence d’une limite. 4. Utiliser la continuité pour passer à la limite. 5. Garder la solution compatible avec l’encadrement.' },
          visual: { type: 'curve', values: [0, 1.4142135624, 1.847759065, 1.961570561, 1.990369453, 1.997590912], labels: ['u₀', 'u₁', 'u₂', 'u₃', 'u₄', 'u₅'], caption: 'Les termes croissent vers 2 ; la preuve établit ce que le dessin suggère.' },
          exercise: { type: 'number', prompt: 'La suite est croissante, dans [0 ; 2], et sa limite vérifie (ℓ − 2)(ℓ + 1) = 0. Quelle est sa limite ?', answer: 2, hint: 'Les deux racines sont 2 et −1. Mais la limite appartient à [0 ; 2] : élimine la racine impossible.', explanation: 'La convergence a été démontrée et ℓ ≥ 0. La racine −1 est exclue : la limite est donc ℓ = 2.' }
        }
      ]
    }
  ]
};
