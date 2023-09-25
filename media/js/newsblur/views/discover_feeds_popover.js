NEWSBLUR.DiscoverFeedsPopover = NEWSBLUR.ReaderPopover.extend({

    className: "NB-discover-popover",

    options: {
        'width': 604,
        'anchor': '.NB-feedbar-discover-container',
        'placement': 'bottom right',
        'offset': {
            top: 18,
            left: -110
        },
        'overlay_top': true,
        'popover_class': 'NB-filter-popover-container',
        'show_markscroll': true
    },

    events: {

    },

    initialize: function (options) {
        this.options = _.extend({}, this.options, options);
        this.options.offset.left = -1 * $(this.options.anchor).width() - 31;

        // console.log("Opening discover popover", this.options, this.options.feed_id);

        NEWSBLUR.ReaderPopover.prototype.initialize.call(this, this.options);
        this.model = NEWSBLUR.assets;

        this.discover_feeds_model = new NEWSBLUR.Collections.DiscoverFeeds();

        this.fetchData();
    },

    fetchData: function () {
        var self = this;

        var feed = this.model.get_feed(this.options.feed_id);
        this.discover_feeds_model.feed_ids = feed.get("discover_feeds");;

        NEWSBLUR.ReaderPopover.prototype.render.call(this);

        this.showLoading();
        try {
            this.discover_feeds_model.fetch({
                success: function () {
                    self.hideLoading();
                    self.render();
                },
                error: function () {
                    self.hideLoading();
                }
            });
        } catch (e) {
            this.onDataLoadError();
        }
    },

    showLoading: function () {

        this.$el.html($.make('div', [
            $.make('div', { className: 'NB-popover-section' }, [
                $.make('div', { className: 'NB-popover-section-title' }, 'Discover sites'),
                $.make('div', { className: 'NB-discover-loading' }, [
                    $.make('div', { className: 'NB-loading NB-active' })
                ])
            ])
        ]));
    },

    hideLoading: function () {
        this.$el.find(".NB-loading").html('');
    },

    onDataLoaded: function () {
        this.hideLoading();
        this.render();
    },

    onDataLoadError: function () {
        this.hideLoading();
        this.$el.find(".NB-discover-loading").html('<div class="error-message">Failed to load related sites</div>');
    },

    render: function () {
        var self = this;

        this.$el.html($.make('div', [
            $.make('div', { className: 'NB-popover-section' }, [
                $.make('div', { className: 'NB-popover-section-title' }, 'Discover sites'),
                $.make('div', { className: 'NB-discover-feed-badges NB-story-pane-west' }, _.flatten(this.discover_feeds_model.map(function (discover_feed) {
                    var $story_titles = $.make('div', { className: 'NB-story-titles' });
                    var story_titles_view = new NEWSBLUR.Views.StoryTitlesView({
                        el: $story_titles,
                        collection: discover_feed.get("stories"),
                        $story_titles: $story_titles,
                        override_layout: 'split',
                        on_discover: discover_feed,
                        in_popover: self
                    });
                    return [
                        new NEWSBLUR.Views.FeedBadge({
                            model: discover_feed.get("feed"),
                            show_folders: true,
                            in_popover: self
                        }),
                        story_titles_view.render().el
                    ];
                })))
            ])
        ]));

        this.check_height();

        return this;
    }


    // ==========
    // = Events =
    // ==========



});