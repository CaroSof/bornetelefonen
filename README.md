# Børnetelefonen Chat Projekt

Dette er en chat applikation udviklet til Børnetelefonen som en del af min EUX Business skoleopgave om hjemmesideudvikling. Applikationen giver børn mulighed for at chatte med rådgivere.

## Forudsætninger

For at køre projektet skal du have følgende installeret på din computer:
- [Node.js](https://nodejs.org/) (version 18 eller nyere)
  - Node.js er et program der skal bruges for at kunne køre vores chat-web-app
  - Det er gratis at hente og installere
  - Node.js bruges af verdens største tech-virksomheder:
    - Netflix bruger det til deres streaming platform
    - LinkedIn bruger det til deres website
    - NASA bruger det til deres rumfarts-systemer
    - PayPal bruger det til deres betalings-platform
  - Vores app bruger Next.js som er bygget på Node.js og React ->(som er skabt af Facebook):
    - Next.js bruges af giganter som TikTok, Nike og Uber
    - Det gør vores app hurtig og sikker ligesom disse store platforme
  - Når du installerer Node.js, får du automatisk også et værktøj der hedder NPM
  - NPM hjælper med at:
    - Hente alle de byggeklodser som chat-web-appen består af
    - Starte applikationen op så du kan bruge den
    - Holde applikationen opdateret med nyeste version

## Installation og kørsel af projektet

Følg disse trin for at installere og køre projektet lokalt:

### Windows

Du kan installere Node.js på bl.a. disse to måder:

#### Mulighed 1: Direkte download
1. Download og installer Node.js fra [nodejs.org](https://nodejs.org/)
   - Vælg LTS (Long Term Support) versionen
   - Kør installationsfilen og følg guiden
   - Når installationen er færdig, åbn kommandoprompten (Windows + R, skriv "cmd")
   - Verificer installationen ved at skrive: `node --version` og `npm --version`

#### Mulighed 2: Via Chocolatey
1. Installer først Chocolatey hvis du ikke har det:
   - Åbn PowerShell som administrator
   - Kør kommandoen: `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`
   - Verificer installationen ved at skrive: `choco --version`
2. Installer Node.js via Chocolatey:
   - Kør kommandoen: `choco install nodejs-lts`
   - Verificer installationen ved at skrive: `node --version` og `npm --version`

Efter Node.js er installeret (uanset metode):

2. Åbn kommandoprompten hvor projektet skal ligge
   - Naviger til den ønskede mappe med `cd` kommandoen
   - Eksempel: `cd C:\Downloads`

3. Installer projektets dependencies:
   - Kør kommandoen: `npm install`

4. Start udviklings-serveren:
   - Kør kommandoen: `npm run dev`
   - Åbn din browser og gå til `http://localhost:3000`

### Mac

Du kan installere Node.js på bl.a. disse to måder:

#### Mulighed 1: Direkte download
1. Download og installer Node.js fra [nodejs.org](https://nodejs.org/)
   - Vælg LTS (Long Term Support) versionen
   - Kør .pkg filen og følg installationsguiden
   - Åbn Terminal (Cmd + Space, søg efter "Terminal")
   - Verificer installationen ved at skrive: `node --version` og `npm --version`

#### Mulighed 2: Via Homebrew
1. Installer først Homebrew hvis du ikke har det:
   - Åbn Terminal og kør: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   - Følg instruktionerne i terminalen
2. Installer Node.js via Homebrew:
   - Kør kommandoen: `brew install node`
   - Verificer installationen ved at skrive: `node --version` og `npm --version`

Efter Node.js er installeret (uanset metode):

2. Åbn Terminal hvor projektet skal ligge
   - Naviger til den ønskede mappe med `cd` kommandoen
   - Eksempel: `cd ~/Downloads/`

3. Installer projektets dependencies:
   - Kør kommandoen: `npm install`

4. Start udviklings-serveren:
   - Kør kommandoen: `npm run dev`
   - Åbn din browser og gå til `http://localhost:3000`


### Nyttige links og ressourcer

- [Video: Kom i gang med Node.js](https://www.youtube.com/watch?v=q-xS25lsN3I) - Introduktion til Node.js
- [Hvad er NPM?](https://yayhosting.dk/ordbog/hvad-er-npm) - Forklaring af Node Package Manager
- [Introduktion til Next.js](https://orimo.dk/introduktion-til-nextjs-hvad-er-det/) - Overblik over Next.js framework
- [Video: Next.js tutorial](https://www.youtube.com/watch?v=__mSgDEOyv8) - Kom i gang med Next.js