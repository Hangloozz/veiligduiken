/*global jQuery*/

(function ($) {
    'use strict';

    var defaultOptions = {
            id: (function () {
                var id = 0;

                return function () {
                    id += 1;

                    return 'menu-' + id;
                };
            }()),
            menu: function ($menu, hamburger) {
                var $wrapper = $('<div id="' + hamburger.id + '"></div>');

                $menu.appendTo($wrapper);
                $wrapper.appendTo(hamburger.grid.getMenu());
            },
            trigger: function (hamburger) {
                var $container = hamburger.grid.getContainer(),
                    id = undefined !== $container.attr('id') ? $container.attr('id') : '';

                return $('<a class="hamburger-trigger ' + id + '" href="javascript:void(null);">Menu</a>').insertAfter($container);
            }
        },
        createHamburger,
        createGrid,
        getId,
        open,
        close,
        toggle;

    /**
     * @param {string|Function} id
     * @returns {string}
     */
    getId = function (id) {
        if (typeof id === 'function') {
            id = id();
        }

        return id;
    };

    createGrid = (function () {
        var grid = null;

        function create() {
            var $body = $('body'),
                $html = $body.children(':not(script)'),
                $container = $('<div id="hamburger-grid"></div>').appendTo($body),
                $wrapper = $('<div class="hamburger-wrapper"></div>').appendTo($container),
                $menu = $('<div class="hamburger-menu"></div>').appendTo($wrapper),
                $content = $('<div class="hamburger-content"></div>').appendTo($wrapper);

            $content.html($html);

            $menu.on({
                click: function (event) {
                    event.stopPropagation();
                }
            });

            return {
                getContainer: function () {
                    return $container;
                },
                getMenu: function () {
                    return $menu;
                },
                getContent: function () {
                    return $content;
                }
            };
        }

        return function () {
            if (null === grid) {
                grid = create();
            }

            return grid;
        };
    }());

    /**
     * @param {Object} hamburger
     */
    open = function (hamburger) {
        hamburger.grid.getContainer().addClass(hamburger.id);
        hamburger.grid.getContainer().addClass('open');
        hamburger.$el.trigger('open');
    };

    /**
     * @param {Object} hamburger
     */
    close = function (hamburger) {
        hamburger.grid.getContainer().removeClass('open');
        hamburger.grid.getContainer().removeClass(hamburger.id);
        hamburger.$el.trigger('close');
    };

    /**
     * @param {Object} hamburger
     */
    toggle = function (hamburger) {
        if (hamburger.grid.getContainer().hasClass('open')) {
            close(hamburger)
        } else {
            open(hamburger);
        }
    };

    /**
     * @param {jQuery} $container
     * @param {Object} options
     */
    createHamburger = function ($container, options) {
        var hamburger = {
            id: getId(options.id),
            grid: createGrid(),
            $el: $container
        };

        hamburger.$menu = options.menu($container.clone(), hamburger);
        hamburger.$trigger = options.trigger(hamburger);

        hamburger.$trigger.on({
            click: function (event) {
                event.preventDefault();
                event.stopPropagation();

                toggle(hamburger);
            }
        });

        $('body').on({
            click: function () {
                close(hamburger);
            }
        });

        $container.on({
            forceClose: function () {
                close(hamburger);
            },
            forceOpen: function () {
                open(hamburger);
            }
        })
    };

    $.fn.hamburger = function (options) {
        options = $.extend({}, defaultOptions, options || {});

        return this.each(function () {
            createHamburger($(this), options);
        });
    };
}(jQuery));