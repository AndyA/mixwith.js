"use strict";

const _cachedRef = Symbol("_cachedApplicationRef");
const _originalMixin = Symbol("_originalMixin");

/**
 * Sets the prototype of mixin to wrapper so that properties set on mixin are
 * inherited by the wrapper.
 *
 * This is needed in order to implement @@hasInstance as a decorator function.
 */
const wrap = (mixin, wrapper) => {
  Object.setPrototypeOf(wrapper, mixin);
  if (!mixin[_originalMixin]) mixin[_originalMixin] = mixin;
  return wrapper;
};

/**
 * Decorates mixin so that it caches its applications. When applied multiple
 * times to the same superclass, mixin will only create one subclass and
 * memoize it.
 */
const Cached = mixin =>
  wrap(mixin, superclass => {
    const applicationRef = (mixin[_cachedRef] =
      mixin[_cachedRef] || Symbol(mixin.name));

    return (superclass[applicationRef] =
      superclass[applicationRef] || mixin(superclass));
  });

/**
 * Decorates a mixin function to add application caching and instanceof
 * support.
 */
const Mixin = mixin => Cached(mixin);
const mix = superClass => new MixinBuilder(superClass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass || class {};
  }

  with(...mixins) {
    return mixins.reduce((c, m) => m(c), this.superclass);
  }
}

module.exports = { Mixin, mix };
