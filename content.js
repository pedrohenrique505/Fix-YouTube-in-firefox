(function () {
    'use strict';
    function blockShorts() {
        if (window.location.pathname.includes('/shorts/')) {
            const videoId = window.location.pathname.split('/shorts/')[1];
            window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
            return;
        }

        const shortsSelectors = [
            'ytd-reel-shelf-renderer',
            'ytd-rich-shelf-renderer[is-shorts]',
            'ytd-reel-item-renderer',
            'ytd-rich-section-renderer:has([title*="Shorts"])',
            'yt-chip-cloud-chip-renderer:has([title="Shorts"])',
            'ytd-grid-renderer:has(ytd-reel-item-renderer)',
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
            'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
            'ytm-shorts-lockup-view-model',
            'ytm-shorts-lockup-view-model-v2',
            'yt-horizontal-list-renderer:has(ytm-shorts-lockup-view-model)',
            'a[href*="/shorts/"]'
        ];

        shortsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
                element.setAttribute('data-blocked-by-extension', 'true');
            });
        });

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

    function expandQueue() {
        const queueContainer = document.querySelector('#related #items, ytd-watch-next-secondary-results-renderer #items');

        if (queueContainer) {
            const items = queueContainer.querySelectorAll('ytd-compact-video-renderer, ytd-video-renderer');
            items.forEach((item, index) => {
                if (index < 5) {
                    item.style.display = 'block';
                    item.style.visibility = 'visible';
                }
            });

            if (queueContainer.parentElement) {
                queueContainer.parentElement.style.maxHeight = 'none';
            }
        }

        const autoplayRenderer = document.querySelector('ytd-compact-autoplay-renderer');
        if (autoplayRenderer) {
            autoplayRenderer.style.maxHeight = 'none';
        }
    }

    const observer = new MutationObserver(() => {
        blockShorts();
        expandQueue();
    });

    function init() {
        blockShorts();
        expandQueue();

        observer.observe(document.body, { childList: true, subtree: true });

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
        }).observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setInterval(() => {
        blockShorts();
        expandQueue();
    }, 2000);
})();
