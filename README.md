# 🎄 Gift Giver - Tirage au Sort de Noël

Une application mobile festive pour organiser des tirages au sort de cadeaux de Noël avec style ! ❄️🎁

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-54.0.20-black.svg)

## ✨ Fonctionnalités

### 🎯 Tirage au Sort Intelligent
- **Algorithme de dérangement** : Garantit qu'aucun participant ne se tire lui-même
- **Animation de roulette** avec effets sonores immersifs
- **Effets visuels** : confettis, neige animée, vibrations
- **Musique de Noël** en arrière-plan pour l'ambiance festive

### 👥 Gestion des Participants
- **Ajout facile** de participants avec noms personnalisés
- **12 avatars uniques** au choix pour chaque participant
- **Édition/suppression** des participants en temps réel
- **Sauvegarde automatique** des données localement

### 🎨 Interface Festive
- **Thème de Noël** avec dégradés et animations
- **Neige qui tombe** en arrière-plan
- **Animations fluides** et feedback haptique
- **Design responsive** pour tous les écrans

### 📱 Fonctionnalités Avancées
- **Code de session unique** pour chaque tirage
- **Capture d'écran** et partage des résultats
- **Configuration du budget** pour les cadeaux
- **Sauvegarde persistante** des paramètres

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- Expo CLI : `npm install -g @expo/cli`
- Pour le développement mobile : Expo Go sur votre téléphone

### Installation
```bash
# Cloner le repository
git clone https://github.com/Peksou/Gift-giver.git
cd gift-giver-fixed

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

### Lancement sur différentes plateformes
```bash
# iOS (simulateur ou appareil)
npm run ios

# Android (émulateur ou appareil)
npm run android

# Web
npm run web
```

## 📱 Utilisation

### 1. **Ajouter des Participants**
- Saisissez le nom du participant
- Choisissez un avatar parmi les 12 disponibles
- Cliquez sur "Ajouter" pour confirmer

### 2. **Configurer le Tirage**
- Définissez le budget souhaité pour les cadeaux
- Assurez-vous d'avoir au minimum 3 participants
- Cliquez sur "Créer la Session"

### 3. **Lancer le Tirage**
- L'animation de tirage se lance automatiquement
- Profitez des effets sonores et visuels
- Les résultats s'affichent avec des confettis !

### 4. **Partager les Résultats**
- Capturez l'écran des résultats
- Partagez directement via les applications installées
- Le code de session permet d'identifier le tirage

## 🛠️ Technologies Utilisées

### Core
- **React Native** `0.81.5` - Framework mobile cross-platform
- **Expo** `54.0.20` - Plateforme de développement
- **TypeScript** `5.9.2` - Typage statique

### UI/UX
- **React Native Safe Area Context** - Gestion des zones sûres
- **Expo Linear Gradient** - Dégradés de couleurs
- **React Native Confetti Cannon** - Effets de confettis
- **React Native View Shot** - Capture d'écran

### Audio/Animations
- **Expo Audio/AV** - Gestion audio avancée
- **Animated API** - Animations natives fluides
- **Expo Sharing** - Partage de contenu

### Stockage
- **AsyncStorage** - Persistance des données locales

## 📁 Structure du Projet

```
gift-giver-fixed/
├── App.tsx                 # Composant principal
├── index.ts               # Point d'entrée
├── package.json           # Dépendances et scripts
├── app.json              # Configuration Expo
├── tsconfig.json         # Configuration TypeScript
└── assets/
    ├── avatars/          # 12 avatars pour les participants
    │   ├── avatar01.png
    │   └── ...
    ├── sounds/           # Effets sonores
    │   ├── drumroll.mp3  # Roulement de tambour
    │   ├── tada.mp3      # Son de victoire
    │   └── Jingle_Bells.mp3  # Musique de fond
    ├── icon.png          # Icône de l'app
    ├── splash-icon.png   # Écran de démarrage
    └── favicon.png       # Favicon web
```

## 🎨 Caractéristiques Techniques

### Algorithme de Tirage
L'application utilise un **algorithme de dérangement** qui garantit mathématiquement qu'aucun participant ne peut se tirer lui-même, même avec un grand nombre de participants.

### Animations
- **Neige animée** : 25 flocons avec mouvement physique réaliste
- **Rotation de roulette** : Animation en boucle pendant le tirage
- **Apparition progressive** : Les résultats apparaissent un par un
- **Feedback haptique** : Vibrations lors des événements importants

### Audio
- **Préchargement** des sons pour une lecture instantanée
- **Gestion des erreurs** audio robuste
- **Musique d'ambiance** en boucle
- **Effets sonores** synchronisés avec les animations

## 🔧 Développement

### Architecture
- **Composants fonctionnels** avec hooks React
- **TypeScript** pour la sécurité des types
- **State management** avec useState et useRef
- **Effets de bord** gérés avec useEffect

### Bonnes Pratiques
- Code modulaire et réutilisable
- Gestion d'erreurs complète
- Performance optimisée pour mobile
- Interface accessible et intuitive

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir des issues pour signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 🎄 Joyeuses Fêtes !

Que cette application apporte de la joie et de la magie à vos célébrations de Noël ! 🎅🎁

---

**Développé avec ❤️ pour les fêtes de fin d'année**