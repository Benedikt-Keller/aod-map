(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
    typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VectorTileLayer = factory(global.L));
})(this, (function (leaflet) { 'use strict';

    var pointGeometry = Point$1;

    /**
     * A standalone point geometry with useful accessor, comparison, and
     * modification methods.
     *
     * @class Point
     * @param {Number} x the x-coordinate. this could be longitude or screen
     * pixels, or any other sort of unit.
     * @param {Number} y the y-coordinate. this could be latitude or screen
     * pixels, or any other sort of unit.
     * @example
     * var point = new Point(-77, 38);
     */
    function Point$1(x, y) {
        this.x = x;
        this.y = y;
    }

    Point$1.prototype = {

        /**
         * Clone this point, returning a new point that can be modified
         * without affecting the old one.
         * @return {Point} the clone
         */
        clone: function() { return new Point$1(this.x, this.y); },

        /**
         * Add this point's x & y coordinates to another point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        add:     function(p) { return this.clone()._add(p); },

        /**
         * Subtract this point's x & y coordinates to from point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        sub:     function(p) { return this.clone()._sub(p); },

        /**
         * Multiply this point's x & y coordinates by point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        multByPoint:    function(p) { return this.clone()._multByPoint(p); },

        /**
         * Divide this point's x & y coordinates by point,
         * yielding a new point.
         * @param {Point} p the other point
         * @return {Point} output point
         */
        divByPoint:     function(p) { return this.clone()._divByPoint(p); },

        /**
         * Multiply this point's x & y coordinates by a factor,
         * yielding a new point.
         * @param {Point} k factor
         * @return {Point} output point
         */
        mult:    function(k) { return this.clone()._mult(k); },

        /**
         * Divide this point's x & y coordinates by a factor,
         * yielding a new point.
         * @param {Point} k factor
         * @return {Point} output point
         */
        div:     function(k) { return this.clone()._div(k); },

        /**
         * Rotate this point around the 0, 0 origin by an angle a,
         * given in radians
         * @param {Number} a angle to rotate around, in radians
         * @return {Point} output point
         */
        rotate:  function(a) { return this.clone()._rotate(a); },

        /**
         * Rotate this point around p point by an angle a,
         * given in radians
         * @param {Number} a angle to rotate around, in radians
         * @param {Point} p Point to rotate around
         * @return {Point} output point
         */
        rotateAround:  function(a,p) { return this.clone()._rotateAround(a,p); },

        /**
         * Multiply this point by a 4x1 transformation matrix
         * @param {Array<Number>} m transformation matrix
         * @return {Point} output point
         */
        matMult: function(m) { return this.clone()._matMult(m); },

        /**
         * Calculate this point but as a unit vector from 0, 0, meaning
         * that the distance from the resulting point to the 0, 0
         * coordinate will be equal to 1 and the angle from the resulting
         * point to the 0, 0 coordinate will be the same as before.
         * @return {Point} unit vector point
         */
        unit:    function() { return this.clone()._unit(); },

        /**
         * Compute a perpendicular point, where the new y coordinate
         * is the old x coordinate and the new x coordinate is the old y
         * coordinate multiplied by -1
         * @return {Point} perpendicular point
         */
        perp:    function() { return this.clone()._perp(); },

        /**
         * Return a version of this point with the x & y coordinates
         * rounded to integers.
         * @return {Point} rounded point
         */
        round:   function() { return this.clone()._round(); },

        /**
         * Return the magitude of this point: this is the Euclidean
         * distance from the 0, 0 coordinate to this point's x and y
         * coordinates.
         * @return {Number} magnitude
         */
        mag: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        /**
         * Judge whether this point is equal to another point, returning
         * true or false.
         * @param {Point} other the other point
         * @return {boolean} whether the points are equal
         */
        equals: function(other) {
            return this.x === other.x &&
                   this.y === other.y;
        },

        /**
         * Calculate the distance from this point to another point
         * @param {Point} p the other point
         * @return {Number} distance
         */
        dist: function(p) {
            return Math.sqrt(this.distSqr(p));
        },

        /**
         * Calculate the distance from this point to another point,
         * without the square root step. Useful if you're comparing
         * relative distances.
         * @param {Point} p the other point
         * @return {Number} distance
         */
        distSqr: function(p) {
            var dx = p.x - this.x,
                dy = p.y - this.y;
            return dx * dx + dy * dy;
        },

        /**
         * Get the angle from the 0, 0 coordinate to this point, in radians
         * coordinates.
         * @return {Number} angle
         */
        angle: function() {
            return Math.atan2(this.y, this.x);
        },

        /**
         * Get the angle from this point to another point, in radians
         * @param {Point} b the other point
         * @return {Number} angle
         */
        angleTo: function(b) {
            return Math.atan2(this.y - b.y, this.x - b.x);
        },

        /**
         * Get the angle between this point and another point, in radians
         * @param {Point} b the other point
         * @return {Number} angle
         */
        angleWith: function(b) {
            return this.angleWithSep(b.x, b.y);
        },

        /*
         * Find the angle of the two vectors, solving the formula for
         * the cross product a x b = |a||b|sin(θ) for θ.
         * @param {Number} x the x-coordinate
         * @param {Number} y the y-coordinate
         * @return {Number} the angle in radians
         */
        angleWithSep: function(x, y) {
            return Math.atan2(
                this.x * y - this.y * x,
                this.x * x + this.y * y);
        },

        _matMult: function(m) {
            var x = m[0] * this.x + m[1] * this.y,
                y = m[2] * this.x + m[3] * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _add: function(p) {
            this.x += p.x;
            this.y += p.y;
            return this;
        },

        _sub: function(p) {
            this.x -= p.x;
            this.y -= p.y;
            return this;
        },

        _mult: function(k) {
            this.x *= k;
            this.y *= k;
            return this;
        },

        _div: function(k) {
            this.x /= k;
            this.y /= k;
            return this;
        },

        _multByPoint: function(p) {
            this.x *= p.x;
            this.y *= p.y;
            return this;
        },

        _divByPoint: function(p) {
            this.x /= p.x;
            this.y /= p.y;
            return this;
        },

        _unit: function() {
            this._div(this.mag());
            return this;
        },

        _perp: function() {
            var y = this.y;
            this.y = this.x;
            this.x = -y;
            return this;
        },

        _rotate: function(angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = cos * this.x - sin * this.y,
                y = sin * this.x + cos * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _rotateAround: function(angle, p) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y),
                y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
            this.x = x;
            this.y = y;
            return this;
        },

        _round: function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        }
    };

    /**
     * Construct a point from an array if necessary, otherwise if the input
     * is already a Point, or an unknown type, return it unchanged
     * @param {Array<Number>|Point|*} a any kind of input value
     * @return {Point} constructed point, or passed-through value.
     * @example
     * // this
     * var point = Point.convert([0, 1]);
     * // is equivalent to
     * var point = new Point(0, 1);
     */
    Point$1.convert = function (a) {
        if (a instanceof Point$1) {
            return a;
        }
        if (Array.isArray(a)) {
            return new Point$1(a[0], a[1]);
        }
        return a;
    };

    var Point = pointGeometry;

    var vectortilefeature = VectorTileFeature$2;

    function VectorTileFeature$2(pbf, end, extent, keys, values) {
        // Public
        this.properties = {};
        this.extent = extent;
        this.type = 0;

        // Private
        this._pbf = pbf;
        this._geometry = -1;
        this._keys = keys;
        this._values = values;

        pbf.readFields(readFeature, this, end);
    }

    function readFeature(tag, feature, pbf) {
        if (tag == 1) { feature.id = pbf.readVarint(); }
        else if (tag == 2) { readTag(pbf, feature); }
        else if (tag == 3) { feature.type = pbf.readVarint(); }
        else if (tag == 4) { feature._geometry = pbf.pos; }
    }

    function readTag(pbf, feature) {
        var end = pbf.readVarint() + pbf.pos;

        while (pbf.pos < end) {
            var key = feature._keys[pbf.readVarint()],
                value = feature._values[pbf.readVarint()];
            feature.properties[key] = value;
        }
    }

    VectorTileFeature$2.types = ['Unknown', 'Point', 'LineString', 'Polygon'];

    VectorTileFeature$2.prototype.loadGeometry = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;

        var end = pbf.readVarint() + pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            lines = [],
            line;

        while (pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();

                if (cmd === 1) { // moveTo
                    if (line) { lines.push(line); }
                    line = [];
                }

                line.push(new Point(x, y));

            } else if (cmd === 7) {

                // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
                if (line) {
                    line.push(line[0].clone()); // closePolygon
                }

            } else {
                throw new Error('unknown command ' + cmd);
            }
        }

        if (line) { lines.push(line); }

        return lines;
    };

    VectorTileFeature$2.prototype.bbox = function() {
        var pbf = this._pbf;
        pbf.pos = this._geometry;

        var end = pbf.readVarint() + pbf.pos,
            cmd = 1,
            length = 0,
            x = 0,
            y = 0,
            x1 = Infinity,
            x2 = -Infinity,
            y1 = Infinity,
            y2 = -Infinity;

        while (pbf.pos < end) {
            if (length <= 0) {
                var cmdLen = pbf.readVarint();
                cmd = cmdLen & 0x7;
                length = cmdLen >> 3;
            }

            length--;

            if (cmd === 1 || cmd === 2) {
                x += pbf.readSVarint();
                y += pbf.readSVarint();
                if (x < x1) { x1 = x; }
                if (x > x2) { x2 = x; }
                if (y < y1) { y1 = y; }
                if (y > y2) { y2 = y; }

            } else if (cmd !== 7) {
                throw new Error('unknown command ' + cmd);
            }
        }

        return [x1, y1, x2, y2];
    };

    VectorTileFeature$2.prototype.toGeoJSON = function(x, y, z) {
        var size = this.extent * Math.pow(2, z),
            x0 = this.extent * x,
            y0 = this.extent * y,
            coords = this.loadGeometry(),
            type = VectorTileFeature$2.types[this.type],
            i, j;

        function project(line) {
            for (var j = 0; j < line.length; j++) {
                var p = line[j], y2 = 180 - (p.y + y0) * 360 / size;
                line[j] = [
                    (p.x + x0) * 360 / size - 180,
                    360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
                ];
            }
        }

        switch (this.type) {
        case 1:
            var points = [];
            for (i = 0; i < coords.length; i++) {
                points[i] = coords[i][0];
            }
            coords = points;
            project(coords);
            break;

        case 2:
            for (i = 0; i < coords.length; i++) {
                project(coords[i]);
            }
            break;

        case 3:
            coords = classifyRings(coords);
            for (i = 0; i < coords.length; i++) {
                for (j = 0; j < coords[i].length; j++) {
                    project(coords[i][j]);
                }
            }
            break;
        }

        if (coords.length === 1) {
            coords = coords[0];
        } else {
            type = 'Multi' + type;
        }

        var result = {
            type: "Feature",
            geometry: {
                type: type,
                coordinates: coords
            },
            properties: this.properties
        };

        if ('id' in this) {
            result.id = this.id;
        }

        return result;
    };

    // classifies an array of rings into polygons with outer rings and holes

    function classifyRings(rings) {
        var len = rings.length;

        if (len <= 1) { return [rings]; }

        var polygons = [],
            polygon,
            ccw;

        for (var i = 0; i < len; i++) {
            var area = signedArea(rings[i]);
            if (area === 0) { continue; }

            if (ccw === undefined) { ccw = area < 0; }

            if (ccw === area < 0) {
                if (polygon) { polygons.push(polygon); }
                polygon = [rings[i]];

            } else {
                polygon.push(rings[i]);
            }
        }
        if (polygon) { polygons.push(polygon); }

        return polygons;
    }

    function signedArea(ring) {
        var sum = 0;
        for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
            p1 = ring[i];
            p2 = ring[j];
            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }
        return sum;
    }

    var VectorTileFeature$1 = vectortilefeature;

    var vectortilelayer = VectorTileLayer$2;

    function VectorTileLayer$2(pbf, end) {
        // Public
        this.version = 1;
        this.name = null;
        this.extent = 4096;
        this.length = 0;

        // Private
        this._pbf = pbf;
        this._keys = [];
        this._values = [];
        this._features = [];

        pbf.readFields(readLayer, this, end);

        this.length = this._features.length;
    }

    function readLayer(tag, layer, pbf) {
        if (tag === 15) { layer.version = pbf.readVarint(); }
        else if (tag === 1) { layer.name = pbf.readString(); }
        else if (tag === 5) { layer.extent = pbf.readVarint(); }
        else if (tag === 2) { layer._features.push(pbf.pos); }
        else if (tag === 3) { layer._keys.push(pbf.readString()); }
        else if (tag === 4) { layer._values.push(readValueMessage(pbf)); }
    }

    function readValueMessage(pbf) {
        var value = null,
            end = pbf.readVarint() + pbf.pos;

        while (pbf.pos < end) {
            var tag = pbf.readVarint() >> 3;

            value = tag === 1 ? pbf.readString() :
                tag === 2 ? pbf.readFloat() :
                tag === 3 ? pbf.readDouble() :
                tag === 4 ? pbf.readVarint64() :
                tag === 5 ? pbf.readVarint() :
                tag === 6 ? pbf.readSVarint() :
                tag === 7 ? pbf.readBoolean() : null;
        }

        return value;
    }

    // return feature `i` from this layer as a `VectorTileFeature`
    VectorTileLayer$2.prototype.feature = function(i) {
        if (i < 0 || i >= this._features.length) { throw new Error('feature index out of bounds'); }

        this._pbf.pos = this._features[i];

        var end = this._pbf.readVarint() + this._pbf.pos;
        return new VectorTileFeature$1(this._pbf, end, this.extent, this._keys, this._values);
    };

    var VectorTileLayer$1 = vectortilelayer;

    var vectortile = VectorTile$1;

    function VectorTile$1(pbf, end) {
        this.layers = pbf.readFields(readTile, {}, end);
    }

    function readTile(tag, layers, pbf) {
        if (tag === 3) {
            var layer = new VectorTileLayer$1(pbf, pbf.readVarint() + pbf.pos);
            if (layer.length) { layers[layer.name] = layer; }
        }
    }

    var VectorTile = vectortile;
    var VectorTileFeature = vectortilefeature;

    /*
     * Copyright 2017, Joachim Kuebart <joachim.kuebart@gmail.com>
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     *   1. Redistributions of source code must retain the above copyright
     *      notice, this list of conditions and the following disclaimer.
     *
     *   2. Redistributions in binary form must reproduce the above copyright
     *      notice, this list of conditions and the following disclaimer in the
     *      documentation and/or other materials provided with the
     *      distribution.
     *
     *   3. Neither the name of the copyright holder nor the names of its
     *      contributors may be used to endorse or promote products derived
     *      from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     */

    function featureLayer(feature, layerName, rootGroup, pxPerExtent, options) {
        var self = new leaflet.Layer(options);
        var m_path = leaflet.SVG.create("path");
        var m_type = VectorTileFeature.types[feature.type];

        options = leaflet.extend({}, options);

        self.feature = feature;
        self.layerName = layerName;

        // Compatibility with Leaflet.VectorGrid
        self.properties = feature.properties;

        /*
         * FeatureLayers only serve as event targets and are never actually
         * "added" to the map, so we override the base class's addTo.
         */
        self.addTo = function addTo(map) {
            // Required by addInteractiveTarget.
            self._map = map;
            self.addInteractiveTarget(m_path);
        };

        self.removeFrom = function removeFrom() {
            self.removeInteractiveTarget(m_path);
            delete self._map;
        };

        self.setStyle = function setStyle(options) {
            var path = m_path;

            options = leaflet.extend(
                {},
                (
                    "Polygon" === m_type
                    ? leaflet.Polygon.prototype.options
                    : leaflet.Path.prototype.options
                ),
                options
            );

            if (options.stroke) {
                path.setAttribute("stroke", options.color);
                path.setAttribute("stroke-opacity", options.opacity);
                path.setAttribute("stroke-width", options.weight);
                path.setAttribute("stroke-linecap", options.lineCap);
                path.setAttribute("stroke-linejoin", options.lineJoin);

                if (options.dashArray) {
                    path.setAttribute("stroke-dasharray", options.dashArray);
                } else {
                    path.removeAttribute("stroke-dasharray");
                }

                if (options.dashOffset) {
                    path.setAttribute("stroke-dashoffset", options.dashOffset);
                } else {
                    path.removeAttribute("stroke-dashoffset");
                }
            } else {
                path.setAttribute("stroke", "none");
            }

            if (options.fill) {
                path.setAttribute("fill", options.fillColor || options.color);
                path.setAttribute("fill-opacity", options.fillOpacity);
                path.setAttribute("fill-rule", options.fillRule || "evenodd");
            } else {
                path.setAttribute("fill", "none");
            }

            if (options.interactive) {
                /*
                 * Leaflet's "interactive" class only applies to
                 * renderers that are immediate descendants of a
                 * pane.
                 */
                path.setAttribute("pointer-events", "auto");
                leaflet.DomUtil.addClass(path, "leaflet-interactive");
            } else {
                leaflet.DomUtil.removeClass(path, "leaflet-interactive");
                path.removeAttribute("pointer-events");
            }

            return path;
        };

        var scalePoint = function (p) { return leaflet.point(p).scaleBy(pxPerExtent); };

        self.bbox = function bbox() {
            var ref = feature.bbox();
            var x0 = ref[0];
            var y0 = ref[1];
            var x1 = ref[2];
            var y1 = ref[3];
            return leaflet.bounds(scalePoint([x0, y0]), scalePoint([x1, y1]));
        };

        switch (m_type) {
        case "Point":
            break;
        case "LineString":
        case "Polygon":
            m_path.setAttribute(
                "d",
                leaflet.SVG.pointsToPath(
                    feature.loadGeometry().map(function (ring) { return ring.map(scalePoint); }),
                    "Polygon" === m_type
                )
            );

            if (options.className) {
                leaflet.DomUtil.addClass(m_path, options.className);
            }
            self.setStyle(options);

            rootGroup.appendChild(m_path);
            break;
        }

        return self;
    }

    var featureLayer$1 = Object.freeze(featureLayer);

    /*
     * Copyright 2017, Joachim Kuebart <joachim.kuebart@gmail.com>
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     *   1. Redistributions of source code must retain the above copyright
     *      notice, this list of conditions and the following disclaimer.
     *
     *   2. Redistributions in binary form must reproduce the above copyright
     *      notice, this list of conditions and the following disclaimer in the
     *      documentation and/or other materials provided with the
     *      distribution.
     *
     *   3. Neither the name of the copyright holder nor the names of its
     *      contributors may be used to endorse or promote products derived
     *      from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     */

    var featureTile = Object.freeze(function featureTile(coords, layer) {
        var self = {};
        var m_tileSize = layer.getTileSize();
        var m_svg = leaflet.SVG.create("svg");
        var m_rootGroup = leaflet.SVG.create("g");
        var m_layers = [];

        m_svg.setAttribute("viewBox", ("0 0 " + (m_tileSize.x) + " " + (m_tileSize.y)));
        m_svg.appendChild(m_rootGroup);

        function addFeature(feature, layerName, pxPerExtent) {
            var featureStyle = layer.getFeatureStyle(feature, layerName);
            if (!featureStyle) {
                return;
            }

            var ftrLyr = featureLayer$1(
                feature,
                layerName,
                m_rootGroup,
                pxPerExtent,
                featureStyle
            );
            m_layers.push(ftrLyr);
            layer.addFeatureLayer(ftrLyr);
        }

        self.addVectorTile = function addVectorTile(vectorTile) {
            Object.keys(vectorTile.layers).forEach(function (layerName) {
                var tileLayer = vectorTile.layers[layerName];
                var pxPerExtent = m_tileSize.divideBy(tileLayer.extent);

                var i = 0;
                while (i !== tileLayer.length) {
                    addFeature(tileLayer.feature(i), layerName, pxPerExtent);
                    i += 1;
                }
            });

            return self;
        };

        self.global = function (p) { return coords.scaleBy(m_tileSize).add(p); };
        self.eachFeatureLayer = function (func) { return m_layers.forEach(
            function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                return func.apply(void 0, args.concat( [self] ));
            }
        ); };
        self.domElement = function () { return m_svg; };
        self.coords = function () { return coords; };

        return self;
    });

    /*
     * Copyright 2017, Joachim Kuebart <joachim.kuebart@gmail.com>
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     *   1. Redistributions of source code must retain the above copyright
     *      notice, this list of conditions and the following disclaimer.
     *
     *   2. Redistributions in binary form must reproduce the above copyright
     *      notice, this list of conditions and the following disclaimer in the
     *      documentation and/or other materials provided with the
     *      distribution.
     *
     *   3. Neither the name of the copyright holder nor the names of its
     *      contributors may be used to endorse or promote products derived
     *      from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     */

    /*jslint browser*/

    /*property
        arrayBuffer, fetch, freeze, ok, onload, open, response, responseType, send,
        status, statusText
    */

    var fetch;
    if ("function" === typeof window.fetch) {
        fetch = window.fetch;
    } else {
        fetch = function (url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url);
            xhr.responseType = "arraybuffer";

            return new Promise(function (resolve) {
                xhr.onload = function () { return resolve({
                    ok: 200 === xhr.status,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    arrayBuffer: function arrayBuffer() {
                        return xhr.response;
                    }
                }); };
                xhr.send();
            });
        };
    }

    var fetch$1 = Object.freeze(fetch);

    var ieee754$1 = {};

    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

    ieee754$1.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = (nBytes * 8) - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? (nBytes - 1) : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];

      i += d;

      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    };

    ieee754$1.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = (nBytes * 8) - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
      var i = isLE ? 0 : (nBytes - 1);
      var d = isLE ? 1 : -1;
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

      value = Math.abs(value);

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = ((value * c) - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = (e << mLen) | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128;
    };

    var pbf = Pbf;

    var ieee754 = ieee754$1;

    function Pbf(buf) {
        this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
        this.pos = 0;
        this.type = 0;
        this.length = this.buf.length;
    }

    Pbf.Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
    Pbf.Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
    Pbf.Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
    Pbf.Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

    var SHIFT_LEFT_32 = (1 << 16) * (1 << 16),
        SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

    // Threshold chosen based on both benchmarking and knowledge about browser string
    // data structures (which currently switch structure types at 12 bytes or more)
    var TEXT_DECODER_MIN_LENGTH = 12;
    var utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf8');

    Pbf.prototype = {

        destroy: function() {
            this.buf = null;
        },

        // === READING =================================================================

        readFields: function(readField, result, end) {
            end = end || this.length;

            while (this.pos < end) {
                var val = this.readVarint(),
                    tag = val >> 3,
                    startPos = this.pos;

                this.type = val & 0x7;
                readField(tag, result, this);

                if (this.pos === startPos) { this.skip(val); }
            }
            return result;
        },

        readMessage: function(readField, result) {
            return this.readFields(readField, result, this.readVarint() + this.pos);
        },

        readFixed32: function() {
            var val = readUInt32(this.buf, this.pos);
            this.pos += 4;
            return val;
        },

        readSFixed32: function() {
            var val = readInt32(this.buf, this.pos);
            this.pos += 4;
            return val;
        },

        // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)

        readFixed64: function() {
            var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
            this.pos += 8;
            return val;
        },

        readSFixed64: function() {
            var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
            this.pos += 8;
            return val;
        },

        readFloat: function() {
            var val = ieee754.read(this.buf, this.pos, true, 23, 4);
            this.pos += 4;
            return val;
        },

        readDouble: function() {
            var val = ieee754.read(this.buf, this.pos, true, 52, 8);
            this.pos += 8;
            return val;
        },

        readVarint: function(isSigned) {
            var buf = this.buf,
                val, b;

            b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) { return val; }
            b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) { return val; }
            b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) { return val; }
            b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) { return val; }
            b = buf[this.pos];   val |= (b & 0x0f) << 28;

            return readVarintRemainder(val, isSigned, this);
        },

        readVarint64: function() { // for compatibility with v2.0.1
            return this.readVarint(true);
        },

        readSVarint: function() {
            var num = this.readVarint();
            return num % 2 === 1 ? (num + 1) / -2 : num / 2; // zigzag encoding
        },

        readBoolean: function() {
            return Boolean(this.readVarint());
        },

        readString: function() {
            var end = this.readVarint() + this.pos;
            var pos = this.pos;
            this.pos = end;

            if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
                // longer strings are fast with the built-in browser TextDecoder API
                return readUtf8TextDecoder(this.buf, pos, end);
            }
            // short strings are fast with our custom implementation
            return readUtf8(this.buf, pos, end);
        },

        readBytes: function() {
            var end = this.readVarint() + this.pos,
                buffer = this.buf.subarray(this.pos, end);
            this.pos = end;
            return buffer;
        },

        // verbose for performance reasons; doesn't affect gzipped size

        readPackedVarint: function(arr, isSigned) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readVarint(isSigned)); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readVarint(isSigned)); }
            return arr;
        },
        readPackedSVarint: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readSVarint()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readSVarint()); }
            return arr;
        },
        readPackedBoolean: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readBoolean()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readBoolean()); }
            return arr;
        },
        readPackedFloat: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readFloat()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readFloat()); }
            return arr;
        },
        readPackedDouble: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readDouble()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readDouble()); }
            return arr;
        },
        readPackedFixed32: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readFixed32()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readFixed32()); }
            return arr;
        },
        readPackedSFixed32: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readSFixed32()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readSFixed32()); }
            return arr;
        },
        readPackedFixed64: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readFixed64()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readFixed64()); }
            return arr;
        },
        readPackedSFixed64: function(arr) {
            if (this.type !== Pbf.Bytes) { return arr.push(this.readSFixed64()); }
            var end = readPackedEnd(this);
            arr = arr || [];
            while (this.pos < end) { arr.push(this.readSFixed64()); }
            return arr;
        },

        skip: function(val) {
            var type = val & 0x7;
            if (type === Pbf.Varint) { while (this.buf[this.pos++] > 0x7f) {} }
            else if (type === Pbf.Bytes) { this.pos = this.readVarint() + this.pos; }
            else if (type === Pbf.Fixed32) { this.pos += 4; }
            else if (type === Pbf.Fixed64) { this.pos += 8; }
            else { throw new Error('Unimplemented type: ' + type); }
        },

        // === WRITING =================================================================

        writeTag: function(tag, type) {
            this.writeVarint((tag << 3) | type);
        },

        realloc: function(min) {
            var length = this.length || 16;

            while (length < this.pos + min) { length *= 2; }

            if (length !== this.length) {
                var buf = new Uint8Array(length);
                buf.set(this.buf);
                this.buf = buf;
                this.length = length;
            }
        },

        finish: function() {
            this.length = this.pos;
            this.pos = 0;
            return this.buf.subarray(0, this.length);
        },

        writeFixed32: function(val) {
            this.realloc(4);
            writeInt32(this.buf, val, this.pos);
            this.pos += 4;
        },

        writeSFixed32: function(val) {
            this.realloc(4);
            writeInt32(this.buf, val, this.pos);
            this.pos += 4;
        },

        writeFixed64: function(val) {
            this.realloc(8);
            writeInt32(this.buf, val & -1, this.pos);
            writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
            this.pos += 8;
        },

        writeSFixed64: function(val) {
            this.realloc(8);
            writeInt32(this.buf, val & -1, this.pos);
            writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
            this.pos += 8;
        },

        writeVarint: function(val) {
            val = +val || 0;

            if (val > 0xfffffff || val < 0) {
                writeBigVarint(val, this);
                return;
            }

            this.realloc(4);

            this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) { return; }
            this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) { return; }
            this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) { return; }
            this.buf[this.pos++] =   (val >>> 7) & 0x7f;
        },

        writeSVarint: function(val) {
            this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
        },

        writeBoolean: function(val) {
            this.writeVarint(Boolean(val));
        },

        writeString: function(str) {
            str = String(str);
            this.realloc(str.length * 4);

            this.pos++; // reserve 1 byte for short string length

            var startPos = this.pos;
            // write the string directly to the buffer and see how much was written
            this.pos = writeUtf8(this.buf, str, this.pos);
            var len = this.pos - startPos;

            if (len >= 0x80) { makeRoomForExtraLength(startPos, len, this); }

            // finally, write the message length in the reserved place and restore the position
            this.pos = startPos - 1;
            this.writeVarint(len);
            this.pos += len;
        },

        writeFloat: function(val) {
            this.realloc(4);
            ieee754.write(this.buf, val, this.pos, true, 23, 4);
            this.pos += 4;
        },

        writeDouble: function(val) {
            this.realloc(8);
            ieee754.write(this.buf, val, this.pos, true, 52, 8);
            this.pos += 8;
        },

        writeBytes: function(buffer) {
            var len = buffer.length;
            this.writeVarint(len);
            this.realloc(len);
            for (var i = 0; i < len; i++) { this.buf[this.pos++] = buffer[i]; }
        },

        writeRawMessage: function(fn, obj) {
            this.pos++; // reserve 1 byte for short message length

            // write the message directly to the buffer and see how much was written
            var startPos = this.pos;
            fn(obj, this);
            var len = this.pos - startPos;

            if (len >= 0x80) { makeRoomForExtraLength(startPos, len, this); }

            // finally, write the message length in the reserved place and restore the position
            this.pos = startPos - 1;
            this.writeVarint(len);
            this.pos += len;
        },

        writeMessage: function(tag, fn, obj) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeRawMessage(fn, obj);
        },

        writePackedVarint:   function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedVarint, arr); }   },
        writePackedSVarint:  function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedSVarint, arr); }  },
        writePackedBoolean:  function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedBoolean, arr); }  },
        writePackedFloat:    function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedFloat, arr); }    },
        writePackedDouble:   function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedDouble, arr); }   },
        writePackedFixed32:  function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedFixed32, arr); }  },
        writePackedSFixed32: function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedSFixed32, arr); } },
        writePackedFixed64:  function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedFixed64, arr); }  },
        writePackedSFixed64: function(tag, arr) { if (arr.length) { this.writeMessage(tag, writePackedSFixed64, arr); } },

        writeBytesField: function(tag, buffer) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeBytes(buffer);
        },
        writeFixed32Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeFixed32(val);
        },
        writeSFixed32Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeSFixed32(val);
        },
        writeFixed64Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeFixed64(val);
        },
        writeSFixed64Field: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeSFixed64(val);
        },
        writeVarintField: function(tag, val) {
            this.writeTag(tag, Pbf.Varint);
            this.writeVarint(val);
        },
        writeSVarintField: function(tag, val) {
            this.writeTag(tag, Pbf.Varint);
            this.writeSVarint(val);
        },
        writeStringField: function(tag, str) {
            this.writeTag(tag, Pbf.Bytes);
            this.writeString(str);
        },
        writeFloatField: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed32);
            this.writeFloat(val);
        },
        writeDoubleField: function(tag, val) {
            this.writeTag(tag, Pbf.Fixed64);
            this.writeDouble(val);
        },
        writeBooleanField: function(tag, val) {
            this.writeVarintField(tag, Boolean(val));
        }
    };

    function readVarintRemainder(l, s, p) {
        var buf = p.buf,
            h, b;

        b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) { return toNum(l, h, s); }
        b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) { return toNum(l, h, s); }
        b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) { return toNum(l, h, s); }
        b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) { return toNum(l, h, s); }
        b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) { return toNum(l, h, s); }
        b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) { return toNum(l, h, s); }

        throw new Error('Expected varint not more than 10 bytes');
    }

    function readPackedEnd(pbf) {
        return pbf.type === Pbf.Bytes ?
            pbf.readVarint() + pbf.pos : pbf.pos + 1;
    }

    function toNum(low, high, isSigned) {
        if (isSigned) {
            return high * 0x100000000 + (low >>> 0);
        }

        return ((high >>> 0) * 0x100000000) + (low >>> 0);
    }

    function writeBigVarint(val, pbf) {
        var low, high;

        if (val >= 0) {
            low  = (val % 0x100000000) | 0;
            high = (val / 0x100000000) | 0;
        } else {
            low  = ~(-val % 0x100000000);
            high = ~(-val / 0x100000000);

            if (low ^ 0xffffffff) {
                low = (low + 1) | 0;
            } else {
                low = 0;
                high = (high + 1) | 0;
            }
        }

        if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
            throw new Error('Given varint doesn\'t fit into 10 bytes');
        }

        pbf.realloc(10);

        writeBigVarintLow(low, high, pbf);
        writeBigVarintHigh(high, pbf);
    }

    function writeBigVarintLow(low, high, pbf) {
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
        pbf.buf[pbf.pos]   = low & 0x7f;
    }

    function writeBigVarintHigh(high, pbf) {
        var lsb = (high & 0x07) << 4;

        pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) { return; }
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) { return; }
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) { return; }
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) { return; }
        pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) { return; }
        pbf.buf[pbf.pos++]  = high & 0x7f;
    }

    function makeRoomForExtraLength(startPos, len, pbf) {
        var extraLen =
            len <= 0x3fff ? 1 :
            len <= 0x1fffff ? 2 :
            len <= 0xfffffff ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));

        // if 1 byte isn't enough for encoding message length, shift the data to the right
        pbf.realloc(extraLen);
        for (var i = pbf.pos - 1; i >= startPos; i--) { pbf.buf[i + extraLen] = pbf.buf[i]; }
    }

    function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) { pbf.writeVarint(arr[i]); }   }
    function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) { pbf.writeSVarint(arr[i]); }  }
    function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) { pbf.writeFloat(arr[i]); }    }
    function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) { pbf.writeDouble(arr[i]); }   }
    function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) { pbf.writeBoolean(arr[i]); }  }
    function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) { pbf.writeFixed32(arr[i]); }  }
    function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) { pbf.writeSFixed32(arr[i]); } }
    function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) { pbf.writeFixed64(arr[i]); }  }
    function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) { pbf.writeSFixed64(arr[i]); } }

    // Buffer code below from https://github.com/feross/buffer, MIT-licensed

    function readUInt32(buf, pos) {
        return ((buf[pos]) |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16)) +
            (buf[pos + 3] * 0x1000000);
    }

    function writeInt32(buf, val, pos) {
        buf[pos] = val;
        buf[pos + 1] = (val >>> 8);
        buf[pos + 2] = (val >>> 16);
        buf[pos + 3] = (val >>> 24);
    }

    function readInt32(buf, pos) {
        return ((buf[pos]) |
            (buf[pos + 1] << 8) |
            (buf[pos + 2] << 16)) +
            (buf[pos + 3] << 24);
    }

    function readUtf8(buf, pos, end) {
        var str = '';
        var i = pos;

        while (i < end) {
            var b0 = buf[i];
            var c = null; // codepoint
            var bytesPerSequence =
                b0 > 0xEF ? 4 :
                b0 > 0xDF ? 3 :
                b0 > 0xBF ? 2 : 1;

            if (i + bytesPerSequence > end) { break; }

            var b1, b2, b3;

            if (bytesPerSequence === 1) {
                if (b0 < 0x80) {
                    c = b0;
                }
            } else if (bytesPerSequence === 2) {
                b1 = buf[i + 1];
                if ((b1 & 0xC0) === 0x80) {
                    c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
                    if (c <= 0x7F) {
                        c = null;
                    }
                }
            } else if (bytesPerSequence === 3) {
                b1 = buf[i + 1];
                b2 = buf[i + 2];
                if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
                    c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
                    if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
                        c = null;
                    }
                }
            } else if (bytesPerSequence === 4) {
                b1 = buf[i + 1];
                b2 = buf[i + 2];
                b3 = buf[i + 3];
                if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                    c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
                    if (c <= 0xFFFF || c >= 0x110000) {
                        c = null;
                    }
                }
            }

            if (c === null) {
                c = 0xFFFD;
                bytesPerSequence = 1;

            } else if (c > 0xFFFF) {
                c -= 0x10000;
                str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
                c = 0xDC00 | c & 0x3FF;
            }

            str += String.fromCharCode(c);
            i += bytesPerSequence;
        }

        return str;
    }

    function readUtf8TextDecoder(buf, pos, end) {
        return utf8TextDecoder.decode(buf.subarray(pos, end));
    }

    function writeUtf8(buf, str, pos) {
        for (var i = 0, c, lead; i < str.length; i++) {
            c = str.charCodeAt(i); // code point

            if (c > 0xD7FF && c < 0xE000) {
                if (lead) {
                    if (c < 0xDC00) {
                        buf[pos++] = 0xEF;
                        buf[pos++] = 0xBF;
                        buf[pos++] = 0xBD;
                        lead = c;
                        continue;
                    } else {
                        c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
                        lead = null;
                    }
                } else {
                    if (c > 0xDBFF || (i + 1 === str.length)) {
                        buf[pos++] = 0xEF;
                        buf[pos++] = 0xBF;
                        buf[pos++] = 0xBD;
                    } else {
                        lead = c;
                    }
                    continue;
                }
            } else if (lead) {
                buf[pos++] = 0xEF;
                buf[pos++] = 0xBF;
                buf[pos++] = 0xBD;
                lead = null;
            }

            if (c < 0x80) {
                buf[pos++] = c;
            } else {
                if (c < 0x800) {
                    buf[pos++] = c >> 0x6 | 0xC0;
                } else {
                    if (c < 0x10000) {
                        buf[pos++] = c >> 0xC | 0xE0;
                    } else {
                        buf[pos++] = c >> 0x12 | 0xF0;
                        buf[pos++] = c >> 0xC & 0x3F | 0x80;
                    }
                    buf[pos++] = c >> 0x6 & 0x3F | 0x80;
                }
                buf[pos++] = c & 0x3F | 0x80;
            }
        }
        return pos;
    }

    /*
     * Copyright 2017, Joachim Kuebart <joachim.kuebart@gmail.com>
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     *   1. Redistributions of source code must retain the above copyright
     *      notice, this list of conditions and the following disclaimer.
     *
     *   2. Redistributions in binary form must reproduce the above copyright
     *      notice, this list of conditions and the following disclaimer in the
     *      documentation and/or other materials provided with the
     *      distribution.
     *
     *   3. Neither the name of the copyright holder nor the names of its
     *      contributors may be used to endorse or promote products derived
     *      from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     */

    function err() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new Error(args.join(": "));
    }

    function load(url) {
        return fetch$1(url).then(function (response) {
            if (response.ok) {
                return response.arrayBuffer();
            }
            if (404 !== response.status) {
                throw err(url, response.status, response.statusText);
            }
        });
    }

    function tileId(coords) {
        return ((coords.x) + "|" + (coords.y) + "|" + (coords.z));
    }

    var defaultOptions = {
        filter: undefined,
        minZoom: 0,
        maxZoom: 18,
        maxDetailZoom: undefined,
        minDetailZoom: undefined,
        subdomains: "abc",
        zoomOffset: 0,
        zoomReverse: false
    };

    var VectorTileLayer = Object.freeze(function vectorTileLayer(url, options) {
        var self = new leaflet.GridLayer(options);
        var m_super = Object.getPrototypeOf(self);
        var m_featureStyle = {};

        function legacyStyle(feature, layerName, zoom) {
            var getFeatureId = options.getFeatureId;
            var vectorTileLayerStyles = options.vectorTileLayerStyles;

            var layerStyle = vectorTileLayerStyles[layerName];
            if (getFeatureId) {
                var fId = getFeatureId(feature);
                if (m_featureStyle[fId]) {
                    layerStyle = m_featureStyle[fId];
                }
            }

            if ("function" === typeof layerStyle) {
                layerStyle = layerStyle(feature.properties, zoom);
            }

            if (Array.isArray(layerStyle)) {
                if (!layerStyle.length) {
                    return;
                }
                layerStyle = layerStyle[0];
            }

            return layerStyle;
        }

        options = leaflet.Util.extend({}, defaultOptions, options);

        if ("string" === typeof options.subdomains) {
            options.subdomains = options.subdomains.split("");
        }

        // Compatibility with Leaflet.VectorGrid
        if (options.vectorTileLayerStyles) {
            options.style = legacyStyle;
        }

        var m_featureTiles = {};
        self.on("tileunload", function (evt) {
            var id = tileId(evt.coords);
            var tile = m_featureTiles[id];

            if (!tile) {
                return;
            }
            tile.eachFeatureLayer(
                function (featureLayer) { return self.removeFeatureLayer(featureLayer); }
            );
            delete m_featureTiles[id];
        });

        var m_map;
        var m_zoom;
        function updateZoom() {
            m_zoom = m_map.getZoom();
        }

        self.onAdd = function onAdd(map) {
            var ref;

            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];
            m_map = map;
            m_map.on("zoomend", updateZoom);
            updateZoom();
            return (ref = m_super.onAdd).call.apply(ref, [ self, map ].concat( rest ));
        };

        self.onRemove = function onRemove() {
            var ref;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            m_map.off("zoomend", updateZoom);
            m_map = undefined;
            return (ref = m_super.onRemove).call.apply(ref, [ self ].concat( args ));
        };

        self.createTile = function createTile(coords, done) {
            var id = tileId(coords);
            var tile = featureTile(coords, self);

            m_featureTiles[id] = tile;
            load(self.getTileUrl(coords)).then(function (buffer) {
                tile.addVectorTile(new VectorTile(new pbf(buffer)));
                done(null, tile);
            }, function (exc) {
                done(exc, tile);
            });

            return tile.domElement();
        };

        function getSubdomain(tilePoint) {
            var index = (
                Math.abs(tilePoint.x + tilePoint.y) %
                options.subdomains.length
            );
            return options.subdomains[index];
        }

        function clampZoom(zoom) {
            var minDetailZoom = options.minDetailZoom;
            var maxDetailZoom = options.maxDetailZoom;

            if (undefined !== minDetailZoom && zoom < minDetailZoom) {
                return minDetailZoom;
            }

            if (undefined !== maxDetailZoom && maxDetailZoom < zoom) {
                return maxDetailZoom;
            }

            return zoom;
        }

        function getZoomForUrl(zoom) {
            var maxZoom = options.maxZoom;
            var zoomReverse = options.zoomReverse;
            var zoomOffset = options.zoomOffset;

            if (zoomReverse) {
                zoom = maxZoom - zoom;
            }

            return clampZoom(zoom + zoomOffset);
        }

        self.getTileUrl = function getTileUrl(coords) {
            var data = {
                s: getSubdomain(coords),
                x: coords.x,
                y: coords.y,
                z: getZoomForUrl(coords.z)
            };
            if (!m_map.options.crs.infinite) {
                data["-y"] = self._globalTileRange.max.y - coords.y;
            }
            return leaflet.Util.template(
                url,
                leaflet.Util.extend(data, options)
            );
        };

        function eachFeatureLayer(func) {
            Object.keys(m_featureTiles).forEach(
                function (tileId) { return m_featureTiles[tileId].eachFeatureLayer(func); }
            );
        }

        self.setStyle = function setStyle(style) {
            options.style = style;

            eachFeatureLayer(function (featureLayer) {
                var feature = featureLayer.feature;
                var layerName = featureLayer.layerName;
                var featureStyle = self.getFeatureStyle(feature, layerName);

                featureLayer.setStyle(featureStyle);
            });

            return self;
        };

        // Compatibilty with Leaflet.VectorGrid
        self.setFeatureStyle = function setFeatureStyle(id, style) {
            m_featureStyle[id] = style;
            self.setStyle(options.style);

            return self;
        };

        // Compatibilty with Leaflet.VectorGrid
        self.resetFeatureStyle = function resetFeatureStyle(id) {
            delete m_featureStyle[id];
            self.setStyle(options.style);

            return self;
        };

        self.getTileSize = function getTileSize() {
            var tileSize = m_super.getTileSize.call(self);
            var zoom = self._tileZoom;

            return tileSize.divideBy(
                m_map.getZoomScale(clampZoom(zoom), zoom)
            ).round();
        };

        self.getFeatureStyle = function getFeatureStyle(feature, layerName) {
            if (options.filter && !options.filter(feature, layerName, m_zoom)) {
                return;
            }

            var style = options.style;

            return (
                "function" === typeof style
                ? style(feature, layerName, m_zoom)
                : style
            );
        };

        self.addFeatureLayer = function addFeatureLayer(featureLayer) {
            featureLayer.addTo(m_map);
            featureLayer.addEventParent(self);

            return self;
        };

        self.removeFeatureLayer = function removeFeatureLayer(featureLayer) {
            featureLayer.removeEventParent(self);
            featureLayer.removeFrom(m_map);

            return self;
        };

        self.getBounds = function getBounds() {
            // Compute bounds in lat/lng for all tiles.
            var bounds;
            eachFeatureLayer(function (layer, idx, ignore, tile) {
                /// Convert from tile coordinates to lat/lng.
                var toLatLng = function (p) { return m_map.unproject(
                    tile.global(p),
                    tile.coords().z
                ); };

                var bbox = layer.bbox();
                var tileBounds = leaflet.latLngBounds(
                    toLatLng(bbox.min),
                    toLatLng(bbox.max)
                );
                if (!bounds) {
                    bounds = tileBounds;
                } else {
                    bounds.extend(tileBounds);
                }
            });

            return bounds;
        };

        return self;
    });

    return VectorTileLayer;

}));
//# sourceMappingURL=VectorTileLayer.umd.js.map
