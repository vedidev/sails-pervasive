'use strict';

const _ = require('underscore');

const Query = function (schema) {
  this._schema = _.clone(schema);
  return this;
};

/**
 * Cast special values to proper types.
 *
 * Ex: Array is stored as "[0,1,2,3]" and should be cast to proper
 * array for return values.
 */

Query.prototype.cast = function (values) {
  const self = this;
  const _values = _.clone(values);

  Object.keys(values).forEach((key) => {
    if (!self._schema[key]) return;

    // Lookup schema type
    const type = self._schema[key].type;
    if (!type) return;

    // Attempt to parse Array or JSON type
    if (type === 'array' || type === 'json') {
      try {
        _values[key] = JSON.parse(values[key]);
      } catch (e) {
        return;
      }
    }

    // Convert booleans back to true/false
    if (type === 'boolean') {
      const val = values[key];
      if (val === 0) _values[key] = false;
      if (val === 1) _values[key] = true;
    }
  });

  return _values;
};

module.exports = Query;
