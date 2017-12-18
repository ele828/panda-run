/*
 * A simple HTML template engine.
 * Author: Eric Wong (ele828@gmail.com)
 * https://www.dobest.me
 * Test remote update
 */
(function(root, sugar) {
    // export sugar class
    typeof module !== 'undefined' && module.exports
        // expose to Node.js Env
        ? module.exports = sugar()
        : typeof define === 'function' && define.amd
        // expose to module loader
        ? define(function(){return sugar()})
        // expose to global namespace -> `window`
        : root.Sugar = sugar();

})(this, function() {

    var Sugar = function(opt) {
        // Set options
        opt && this.set(opt);
    };

    Sugar.prototype = {

        options: {
            stag: '<%',
            etag: '%>',
            escape: false
        },

        // set engine options
        set: function(opt) {
            this.options.stag = opt.stag || this.options.stag;
            this.options.etag = opt.etag || this.options.etag;
            this.options.doEspace = opt.escape || this.options.escape;
        },

        compile: function(html, data) {
            return this._compile(
                this.options.escape
                    ? this.escapeHTML(html)
                    : html
                ,data
            );
        },

        // compile HTML with data to HTML
        _compile: function(html, data) {
            var tagRegexStr = this.options.stag + '([^'+ this.options.etag +']+)?' + this.options.etag;
            var tagRegex = new RegExp(tagRegexStr, 'igm');

            var exprRegex = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                commonExprRe = /(forEach|map|reduce|filter|hasOwnProperty|Object)(.*)?/g,
                quotesRegex = /"/g,
                cursor = 0,
                match;

            var escapeQuotes = function(str) {
                return str.replace(quotesRegex, '\\"');
            };

            // return part of processed template
            var append = function(tpl, match, cursor) {
                var newTpl = [];
                var str = match[1].trim();
                if (str === '')
                    return '';

                var prev = escapeQuotes( tpl.slice(cursor, match.index) );
                newTpl.push( ['r.push("', prev, '");'].join('') );

                var isExpr = !!(str.match(exprRegex) || str.match(commonExprRe));
                // It's an Expression
                if (isExpr) {
                    newTpl.push(str+'\n');
                } else {
                    newTpl.push(
                        ['r.push(', str, ');', '\n'].join('')
                    );
                }

                return newTpl.join('\n');
            };

            var tpl = [];
            tpl.push('var r=[];\n');
            tpl.push('with(this){\n');
            while(match = tagRegex.exec(html)) {
                tpl.push( append(html, match, cursor) );
                cursor = match.index + match[0].length;
            }
            // the rest of tmpl
            var rest = escapeQuotes(html.substr(cursor, html.length - cursor));
            tpl.push( ['r.push("', rest, '");'].join('') );
            tpl.push('}\n');
            tpl.push( 'return r.join("");' );
            return new Function(tpl.join('').replace(/[\r\t\n]/g, ''))
                    .apply(data);
        },

        // escape nonlicet HTML
        escapeHTML: function(str) {
            return this.options.doEspace
                ? typeof(str) !== 'string' ? str : str.replace(/[&<>"']/igm,
                function escapeReplace(k) {
                    return {
                        '<': '&lt;',
                        '>': '&gt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        "'": '&#x27;',
                        '/': '&#x2f;'
                    }[k];
                }) : str;
        }

    };

    return Sugar;
});
