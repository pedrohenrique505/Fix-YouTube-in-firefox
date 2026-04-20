// YouTube Customizer - Content Script

(function () {
    'use strict';

    // ============================================
    // PARTE 1: BLOQUEAR SHORTS
    // ============================================

    // Função para bloquear shorts
    function blockShorts() {
        // Redirecionar se estiver em uma URL de shorts
        if (window.location.pathname.includes('/shorts/')) {
            const videoId = window.location.pathname.split('/shorts/')[1];
            window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
            return;
        }

        // Seletores para identificar elementos de shorts
        const shortsSelectors = [
            // Shorts shelf na página inicial
            'ytd-reel-shelf-renderer',
            'ytd-rich-shelf-renderer[is-shorts]',
            // Shorts individuais
            'ytd-reel-item-renderer',
            // Seção de shorts
            'ytd-rich-section-renderer:has([title*="Shorts"])',
            // Chips/abas de shorts
            'yt-chip-cloud-chip-renderer:has([title="Shorts"])',
            // Grid de shorts
            'ytd-grid-renderer:has(ytd-reel-item-renderer)',
            // Novos seletores baseados no novo visual do YouTube
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
            'ytm-shorts-lockup-view-model',
            'ytm-shorts-lockup-view-model-v2',
            'yt-horizontal-list-renderer:has(ytm-shorts-lockup-view-model)',
            // Links para shorts
            'a[href*="/shorts/"]'
        ];

        // Remover elementos de shorts
        shortsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Esconder ao invés de remover para não quebrar o layout
                element.style.display = 'none';
                element.setAttribute('data-blocked-by-extension', 'true');
            });
        });

        // Bloquear links de shorts antes do clique
        document.querySelectorAll('a[href*="/shorts/"]').forEach(link => {
            if (!link.hasAttribute('data-shorts-blocked')) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const videoId = this.href.split('/shorts/')[1]?.split('?')[0];
                    if (videoId) {
                        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
                    }
                }, true);
                link.setAttribute('data-shorts-blocked', 'true');
            }
        });
    }

    // ============================================
    // PARTE 2: EXPANDIR FILA DE VÍDEOS
    // ============================================

    function expandQueue() {
        // Encontrar o container da fila (next/autoplay)
        const queueContainer = document.querySelector('#related #items, ytd-watch-next-secondary-results-renderer #items');

        if (queueContainer) {
            // Forçar mais vídeos visíveis através de atributos
            const items = queueContainer.querySelectorAll('ytd-compact-video-renderer, ytd-video-renderer');

            // Mostrar até 5 vídeos
            items.forEach((item, index) => {
                if (index < 5) {
                    item.style.display = 'block';
                    item.style.visibility = 'visible';
                }
            });

            // Ajustar o container para acomodar mais vídeos
            if (queueContainer.parentElement) {
                queueContainer.parentElement.style.maxHeight = 'none';
            }
        }

        // Para a página de watch, forçar mais vídeos recomendados
        const autoplayRenderer = document.querySelector('ytd-compact-autoplay-renderer');
        if (autoplayRenderer) {
            autoplayRenderer.style.maxHeight = 'none';
        }
    }

    // ============================================
    // OBSERVADOR DE MUDANÇAS NO DOM
    // ============================================

    // Criar um MutationObserver para aplicar as regras quando o YouTube carregar conteúdo dinamicamente
    const observer = new MutationObserver((mutations) => {
        blockShorts();
        expandQueue();
    });

    // Iniciar observação quando o DOM estiver pronto
    function init() {
        blockShorts();
        expandQueue();

        // Observar mudanças no body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Aplicar novamente quando houver navegação (YouTube é SPA)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    blockShorts();
                    expandQueue();
                }, 500);
            }
        }).observe(document.querySelector('title'), {
            subtree: true,
            characterData: true,
            childList: true
        });
    }

    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Aplicar a cada 2 segundos para garantir (YouTube carrega conteúdo assincronamente)
    setInterval(() => {
        blockShorts();
        expandQueue();
    }, 2000);

    console.log('YouTube Customizer: Extensão carregada');
})();
