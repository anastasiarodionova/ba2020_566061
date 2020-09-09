/*global DateTimeShortcuts, SelectFilter*/
/**
 * Django admin inlines
 *
 * Based on jQuery Formset 1.1
 * @author Stanislaus Madueke (stan DOT madueke AT gmail DOT com)
 * @requires jQuery 1.2.6 or later
 *
 * Copyright (c) 2009, Stanislaus Madueke
 * All rights reserved.
 *
 * Spiced up with Code from Zain Memon's GSoC project 2009
 * and modified for Django by Jannis Leidel, Travis Swicegood and Julien Phalip.
 *
 * Licensed under the New BSD License
 * See: https://opensource.org/licenses/bsd-license.php
 */
'use strict';
{
    const $ = django.jQuery;
    $.fn.formset = function(opts) {
        const options = $.extend({}, $.fn.formset.defaults, opts);
        const $this = $(this);
        const $parent = $this.parent();
        const updateElementIndex = function(el, prefix, ndx) {
            const id_regex = new RegExp("(" + prefix + "-(\\d+|__prefix__))");
            const replacement = prefix + "-" + ndx;
            if ($(el).prop("for")) {
                $(el).prop("for", $(el).prop("for").replace(id_regex, replacement));
            }
            if (el.id) {
                el.id = el.id.replace(id_regex, replacement);
            }
            if (el.name) {
                el.name = el.name.replace(id_regex, replacement);
            }
        };
        const totalForms = $("#id_" + options.prefix + "-TOTAL_FORMS").prop("autocomplete", "off");
        let nextIndex = parseInt(totalForms.val(), 10);
        const maxForms = $("#id_" + options.prefix + "-MAX_NUM_FORMS").prop("autocomplete", "off");
        const minForms = $("#id_" + options.prefix + "-MIN_NUM_FORMS").prop("autocomplete", "off");
        let addButton;

        /**
         * The "Add another MyModel" button below the inline forms.
         */
        const addInlineAddButton = function() {
            if (addButton === null) {
                if ($this.prop("tagName") === "TR") {
                    // If forms are laid out as table rows, insert the
                    // "add" button in a new table row:
                    const numCols = $this.eq(-1).children().length;
                    $parent.append('<tr class="' + options.addCssClass + '"><td colspan="' + numCols + '"><a href="#">' + options.addText + "</a></tr>");
                    addButton = $parent.find("tr:last a");
                } else {
                    // Otherwise, insert it immediately after the last form:
                    $this.filter(":last").after('<div class="' + options.addCssClass + '"><a href="#">' + options.addText + "</a></div>");
                    addButton = $this.filter(":last").next().find("a");
                }
            }
            addButton.on('click', addInlineClickHandler);
        };

        const addInlineClickHandler = function(e) {
            e.preventDefault();
            const template = $("#" + options.prefix + "-empty");
            const row = template.clone(true);
            row.removeClass(options.emptyCssClass)
                .addClass(options.formCssClass)
                .attr("id", options.prefix + "-" + nextIndex);
            addInlineDeleteButton(row);
            row.find("*").each(function() {
                updateElementIndex(this, options.prefix, totalForms.val());
            });

            row.insertBefore($(template));
            // Update number of total forms.
            $(totalForms).val(parseInt(totalForms.val(), 10) + 1);
            nextIndex += 1;

            if ((maxForms.val() !== '') && (maxForms.val() - totalForms.val()) <= 0) {
                addButton.parent().hide();
            }

            toggleDeleteButtonVisibility(row.closest('.inline-group'));


            if (options.added) {
                options.added(row);
            }
            $(document).trigger('formset:added', [row, options.prefix]);
        };


        const addInlineDeleteButton = function(row) {
            if (row.is("tr")) {

                row.children(":last").append('<div><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></div>");
            } else if (row.is("ul") || row.is("ol")) {

                row.append('<li><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></li>");
            } else {

                row.children(":first").append('<span><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></span>");
            }

            row.find("a." + options.deleteCssClass).on('click', inlineDeleteHandler.bind(this));
        };

        const inlineDeleteHandler = function(e1) {
            e1.preventDefault();
            const deleteButton = $(e1.target);
            const row = deleteButton.closest('.' + options.formCssClass);
            const inlineGroup = row.closest('.inline-group');

            const prevRow = row.prev();
            if (prevRow.length && prevRow.hasClass('row-form-errors')) {
                prevRow.remove();
            }
            row.remove();
            nextIndex -= 1;

            if (options.removed) {
                options.removed(row);
            }
            $(document).trigger('formset:removed', [row, options.prefix]);

            const forms = $("." + options.formCssClass);
            $("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);

            if ((maxForms.val() === '') || (maxForms.val() - forms.length) > 0) {
                addButton.parent().show();
            }

            toggleDeleteButtonVisibility(inlineGroup);

            let i, formCount;
            const updateElementCallback = function() {
                updateElementIndex(this, options.prefix, i);
            };
            for (i = 0, formCount = forms.length; i < formCount; i++) {
                updateElementIndex($(forms).get(i), options.prefix, i);
                $(forms.get(i)).find("*").each(updateElementCallback);
            }
        };

        const toggleDeleteButtonVisibility = function(inlineGroup) {
            if ((minForms.val() !== '') && (minForms.val() - totalForms.val()) >= 0) {
                inlineGroup.find('.inline-deletelink').hide();
            } else {
                inlineGroup.find('.inline-deletelink').show();
            }
        };

        $this.each(function(i) {
            $(this).not("." + options.emptyCssClass).addClass(options.formCssClass);
        });

        $this.filter('.' + options.formCssClass + ':not(.has_original):not(.' + options.emptyCssClass + ')').each(function() {
            addInlineDeleteButton($(this));
        });
        toggleDeleteButtonVisibility($this);


        addButton = options.addButton;
        addInlineAddButton();


        const showAddButton = maxForms.val() === '' || (maxForms.val() - totalForms.val()) > 0;
        if ($this.length && showAddButton) {
            addButton.parent().show();
        } else {
            addButton.parent().hide();
        }

        return this;
    };

    /* Setup plugin defaults */
    $.fn.formset.defaults = {
        prefix: "form",
        addText: "add another",
        deleteText: "remove",
        addCssClass: "add-row",
        deleteCssClass: "delete-row",
        emptyCssClass: "empty-row",
        formCssClass: "dynamic-form",
        added: null,
        removed: null,
        addButton: null
    };


    // Tabular inlines ---------------------------------------------------------
    $.fn.tabularFormset = function(selector, options) {
        const $rows = $(this);

        const reinitDateTimeShortCuts = function() {

            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        const updateSelectFilter = function() {

            if (typeof SelectFilter !== 'undefined') {
                $('.selectfilter').each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $('.selectfilterstacked').each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        const initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                const field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
            },
            addButton: options.addButton
        });

        return $rows;
    };

    // Stacked inlines ---------------------------------------------------------
    $.fn.stackedFormset = function(selector, options) {
        const $rows = $(this);
        const updateInlineLabel = function(row) {
            $(selector).find(".inline_label").each(function(i) {
                const count = i + 1;
                $(this).html($(this).html().replace(/(#\d+)/g, "#" + count));
            });
        };

        const reinitDateTimeShortCuts = function() {

            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        const updateSelectFilter = function() {

            if (typeof SelectFilter !== "undefined") {
                $(".selectfilter").each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $(".selectfilterstacked").each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        const initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                const field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            removed: updateInlineLabel,
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
                updateInlineLabel(row);
            },
            addButton: options.addButton
        });

        return $rows;
    };

    $(document).ready(function() {
        $(".js-inline-admin-formset").each(function() {
            const data = $(this).data(),
                inlineOptions = data.inlineFormset;
            let selector;
            switch(data.inlineType) {
            case "stacked":
                selector = inlineOptions.name + "-group .inline-related";
                $(selector).stackedFormset(selector, inlineOptions.options);
                break;
            case "tabular":
                selector = inlineOptions.name + "-group .tabular.inline-related tbody:first > tr.form-row";
                $(selector).tabularFormset(selector, inlineOptions.options);
                break;
            }
        });
    });
}
