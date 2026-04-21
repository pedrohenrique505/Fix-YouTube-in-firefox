# YouTube Customizer - Extensão Firefox

Uma extensão para Firefox que bloqueia os YouTube Shorts e expande a fila de vídeos recomendados para 5 vídeos.

## 🎯 Funcionalidades

1. **Bloqueio de Shorts**: Remove completamente todos os Shorts do YouTube
   - Bloqueia shorts na página inicial
   - Bloqueia shorts nos resultados de busca
   - Redireciona URLs de shorts (/shorts/) para vídeos normais (/watch)
   - Remove os botões/chips de navegação para Shorts

2. **Expansão da Fila**: Mostra 5 vídeos na fila ao invés de 3
   - Expande a seção de vídeos recomendados
   - Mantém todos os 5 vídeos sempre visíveis

## 📦 Instalação

### Método 1: Instalação Temporária (para testes)

1. Abra o Firefox
2. Digite `about:debugging` na barra de endereços
3. Clique em "Este Firefox" (ou "This Firefox")
4. Clique em "Carregar extensão temporária..." (ou "Load Temporary Add-on...")
5. Navegue até a pasta da extensão e selecione o arquivo `manifest.json`
6. A extensão será carregada (ficará ativa até fechar o Firefox)

### Método 2: Instalação Permanente (empacotando)

1. Empacote a extensão em um arquivo .xpi:
   ```bash
   cd youtube-customizer
   zip -r ../youtube-customizer.xpi *
   ```

2. No Firefox, vá em `about:addons`
3. Clique no ícone de engrenagem ⚙️
4. Selecione "Instalar extensão a partir de arquivo..."
5. Escolha o arquivo `youtube-customizer.xpi`

**Nota**: Para instalação permanente de extensões não assinadas, você precisa:
- Usar Firefox Developer Edition ou Firefox Nightly
- Ou assinar a extensão no site de desenvolvedores da Mozilla

## 🔧 Como Funciona

### Arquitetura da Extensão

A extensão usa três componentes principais:

1. **manifest.json**: Define as permissões e metadados
2. **content.js**: Script que roda nas páginas do YouTube
3. **styles.css**: Regras CSS para esconder elementos

### Detalhes Técnicos

#### Bloqueio de Shorts

O script usa múltiplas estratégias:

```javascript
// 1. Detecta navegação para URLs de shorts
if (window.location.pathname.includes('/shorts/')) {
    // Redireciona para formato normal
    window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
}

// 2. Remove elementos do DOM usando seletores CSS
const shortsSelectors = [
    'ytd-reel-shelf-renderer',  // Shelf de shorts
    'ytd-reel-item-renderer',   // Shorts individuais
    'a[href*="/shorts/"]'       // Links para shorts
];

// 3. Intercepta cliques em links de shorts
link.addEventListener('click', function(e) {
    e.preventDefault();
    // Converte para vídeo normal
});
```

#### Expansão da Fila

O YouTube limita artificialmente quantos vídeos mostra. A extensão:

```javascript
// 1. Encontra o container da fila
const queueContainer = document.querySelector('#related #items');

// 2. Force visibilidade dos primeiros 5 vídeos
items.forEach((item, index) => {
    if (index < 5) {
        item.style.display = 'block';
        item.style.visibility = 'visible';
    }
});
```

#### MutationObserver

Como o YouTube é uma Single Page Application (SPA), o conteúdo é carregado dinamicamente. Usamos um MutationObserver para detectar mudanças:

```javascript
const observer = new MutationObserver((mutations) => {
    blockShorts();
    expandQueue();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

## 🛠️ Personalização

### Modificar o número de vídeos na fila

No arquivo `content.js`, encontre esta linha:

```javascript
if (index < 5) {  // Mude 5 para o número desejado
```

### Adicionar mais bloqueios

No array `shortsSelectors`, adicione novos seletores CSS:

```javascript
const shortsSelectors = [
    'ytd-reel-shelf-renderer',
    'seu-novo-seletor-aqui'
];
```

## 📚 Recursos para Aprender Mais

### Livros Recomendados

1. **"JavaScript: The Definitive Guide"** - David Flanagan
   - Referência completa sobre JavaScript
   - Cobre manipulação de DOM e eventos
   - Essencial para entender o content script

2. **"Web Extensions"** - Mozilla Developer Network (Online)
   - Guia oficial da Mozilla sobre WebExtensions
   - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions

3. **"Eloquent JavaScript"** - Marijn Haverbeke
   - Excelente para entender JavaScript moderno
   - Capítulos sobre DOM e eventos navegador
   - Gratuito online: https://eloquentjavascript.net/

### Documentação Oficial

- **MDN Web Docs**: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons
- **Chrome Extensions Docs** (compatível): https://developer.chrome.com/docs/extensions/

### Conceitos Importantes para Estudar

1. **DOM Manipulation**: Como JavaScript interage com HTML
2. **MutationObserver API**: Observar mudanças no DOM
3. **Event Delegation**: Capturar eventos eficientemente
4. **CSS Selectors**: Identificar elementos precisamente
5. **Content Security Policy**: Entender limitações de segurança

## 🐛 Solução de Problemas

### Shorts ainda aparecem

1. Recarregue a página completamente (Ctrl+F5)
2. Verifique se a extensão está ativa em `about:addons`
3. Abra o console (F12) e procure por erros

### Fila não mostra 5 vídeos

- O YouTube pode não ter 5 vídeos para mostrar
- Alguns vídeos podem estar carregando assincronamente
- Aguarde alguns segundos após carregar a página

### Extensão para de funcionar após fechar Firefox

- Isso é normal para instalação temporária
- Use o Método 2 de instalação para torná-la permanente

## 📝 Estrutura de Arquivos

```
youtube-customizer/
├── manifest.json      # Configuração da extensão
├── content.js         # Script principal
├── styles.css         # Estilos CSS
├── icon.png           # Ícone da extensão
└── README.md          # Este arquivo
```

## 🔐 Permissões

A extensão requer apenas:
- Acesso ao domínio youtube.com (para modificar a página)
- Nenhuma permissão de rede ou dados pessoais

## 📄 Licença

Este código é livre para uso pessoal e educacional.

---

**Nota**: Esta extensão modifica apenas a interface do YouTube localmente no seu navegador. Nenhum dado é enviado para servidores externos.
