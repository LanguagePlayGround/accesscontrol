"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../enums");
var utils_1 = require("../utils");
/**
 *  Represents the inner `Access` class that helps build an access information
 *  to be granted or denied; and finally commits it to the underlying grants
 *  model. You can get a first instance of this class by calling
 *  `AccessControl#grant()` or `AccessControl#deny()` methods.
 *  @class
 *  @inner
 *  @memberof AccessControl
 */
var Access = (function () {
    /**
     *  Initializes a new instance of `Access`.
     *  @private
     *
     *  @param {Any} grants
     *         Main grants object.
     *  @param {String|Array<String>|IAccessInfo} roleOrInfo
     *         Either an `IAccessInfo` object, a single or an array of
     *         roles. If an object is passed, possession and attributes
     *         properties are optional. CAUTION: if attributes is omitted,
     *         and access is not denied, it will default to `["*"]` which means
     *         "all attributes allowed". If possession is omitted, it will
     *         default to `"any"`.
     *  @param {Boolean} denied
     *         Specifies whether this `Access` is denied.
     */
    function Access(grants, roleOrInfo, denied) {
        if (denied === void 0) { denied = false; }
        /**
         *  Inner `IAccessInfo` object.
         *  @protected
         *  @type {IAccessInfo}
         */
        this._ = {};
        this._grants = grants;
        this._.denied = denied;
        if (typeof roleOrInfo === 'string' || Array.isArray(roleOrInfo)) {
            this.role(roleOrInfo);
        }
        else if (utils_1.default.type(roleOrInfo) === 'object') {
            // if an IAccessInfo instance is passed and it has 'action' defined, we
            // should directly commit it to grants.
            roleOrInfo.denied = denied;
            this._ = utils_1.default.resetAttributes(roleOrInfo);
            if (utils_1.default.isInfoFulfilled(this._))
                utils_1.default.commitToGrants(this._grants, this._, true);
        }
    }
    Object.defineProperty(Access.prototype, "denied", {
        // -------------------------------
        //  PUBLIC PROPERTIES
        // -------------------------------
        /**
         *  Specifies whether this access is initally denied.
         *  @name AccessControl~Access#denied
         *  @type {Boolean}
         *  @readonly
         */
        get: function () {
            return this._.denied;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------
    //  PUBLIC METHODS
    // -------------------------------
    /**
     *  A chainer method that sets the role(s) for this `Access` instance.
     *  @param {String|Array<String>} value
     *         A single or array of roles.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.role = function (value) {
        this._.role = value;
        return this;
    };
    /**
     *  A chainer method that sets the resource for this `Access` instance.
     *  @param {String|Array<String>} value
     *         Target resource for this `Access` instance.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.resource = function (value) {
        this._.resource = value;
        return this;
    };
    /**
     *  Sets the array of allowed attributes for this `Access` instance.
     *  @param {String|Array<String>} value
     *         Attributes to be set.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.attributes = function (value) {
        this._.attributes = value;
        return this;
    };
    /**
     *  Sets the roles to be extended for this `Access` instance.
     *  @param {String|Array<String>} roles
     *         A single or array of roles.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.extend = function (roles) {
        utils_1.default.extendRole(this._grants, this._.role, roles);
        return this;
    };
    /**
     *  Shorthand to switch to a new `Access` instance with a different role
     *  within the method chain.
     *
     *  @param {String|Array<String>|IAccessInfo} [roleOrInfo]
     *         Either a single or an array of roles or an
     *         {@link ?api=ac#AccessControl~IAccessInfo|`IAccessInfo` object}.
     *
     *  @returns {Access}
     *           A new `Access` instance.
     *
     *  @example
     *  ac.grant('user').createOwn('video')
     *    .grant('admin').updateAny('video');
     */
    Access.prototype.grant = function (roleOrInfo) {
        return (new Access(this._grants, roleOrInfo, false)).attributes(['*']);
    };
    /**
     *  Shorthand to switch to a new `Access` instance with a different
     *  (or same) role within the method chain.
     *
     *  @param {String|Array<String>|IAccessInfo} [roleOrInfo]
     *         Either a single or an array of roles or an
     *         {@link ?api=ac#AccessControl~IAccessInfo|`IAccessInfo` object}.
     *
     *  @returns {Access}
     *           A new `Access` instance.
     *
     *  @example
     *  ac.grant('admin').createAny('video')
     *    .deny('user').deleteAny('video');
     */
    Access.prototype.deny = function (roleOrInfo) {
        return (new Access(this._grants, roleOrInfo, true)).attributes([]);
    };
    /**
     *  Sets the action to `"create"` and possession to `"own"` and commits the
     *  current access instance to the underlying grant model.
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid
     *  data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.createOwn = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.CREATE, enums_1.Possession.OWN, resource, attributes);
    };
    /**
     *  Sets the action to `"create"` and possession to `"any"` and commits the
     *  current access instance to the underlying grant model.
     *  @alias Access#create
     *  @name AccessControl~Access#createAny
     *  @function
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.createAny = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.CREATE, enums_1.Possession.ANY, resource, attributes);
    };
    /**
     *  Alias if `createAny`
     *  @private
     */
    Access.prototype.create = function (resource, attributes) {
        return this.createAny(resource, attributes);
    };
    /**
     *  Sets the action to `"read"` and possession to `"own"` and commits the
     *  current access instance to the underlying grant model.
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.readOwn = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.READ, enums_1.Possession.OWN, resource, attributes);
    };
    /**
     *  Sets the action to `"read"` and possession to `"any"` and commits the
     *  current access instance to the underlying grant model.
     *  @alias Access#read
     *  @name AccessControl~Access#readAny
     *  @function
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.readAny = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.READ, enums_1.Possession.ANY, resource, attributes);
    };
    /**
     *  Alias if `readAny`
     *  @private
     */
    Access.prototype.read = function (resource, attributes) {
        return this.readAny(resource, attributes);
    };
    /**
     *  Sets the action to `"update"` and possession to `"own"` and commits the
     *  current access instance to the underlying grant model.
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.updateOwn = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.UPDATE, enums_1.Possession.OWN, resource, attributes);
    };
    /**
     *  Sets the action to `"update"` and possession to `"any"` and commits the
     *  current access instance to the underlying grant model.
     *  @alias Access#update
     *  @name AccessControl~Access#updateAny
     *  @function
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.updateAny = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.UPDATE, enums_1.Possession.ANY, resource, attributes);
    };
    /**
     *  Alias if `updateAny`
     *  @private
     */
    Access.prototype.update = function (resource, attributes) {
        return this.updateAny(resource, attributes);
    };
    /**
     *  Sets the action to `"delete"` and possession to `"own"` and commits the
     *  current access instance to the underlying grant model.
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.deleteOwn = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.DELETE, enums_1.Possession.OWN, resource, attributes);
    };
    /**
     *  Sets the action to `"delete"` and possession to `"any"` and commits the
     *  current access instance to the underlying grant model.
     *  @alias Access#delete
     *  @name AccessControl~Access#deleteAny
     *  @function
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If access is denied previously by calling `.deny()` this
     *         will default to an empty array (which means no attributes allowed).
     *         Otherwise (if granted before via `.grant()`) this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.deleteAny = function (resource, attributes) {
        return this._prepareAndCommit(enums_1.Action.DELETE, enums_1.Possession.ANY, resource, attributes);
    };
    /**
     *  Alias if `deleteAny`
     *  @private
     */
    Access.prototype.delete = function (resource, attributes) {
        return this.deleteAny(resource, attributes);
    };
    // -------------------------------
    //  PRIVATE METHODS
    // -------------------------------
    /**
     *  @private
     *  @param {String} action     [description]
     *  @param {String} possession [description]
     *  @param {String|Array<String>} resource   [description]
     *  @param {String|Array<String>} attributes [description]
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype._prepareAndCommit = function (action, possession, resource, attributes) {
        this._.action = action;
        this._.possession = possession;
        if (resource)
            this._.resource = resource;
        if (attributes)
            this._.attributes = attributes;
        if (this._.denied) {
            this._.attributes = [];
        }
        else {
            // if omitted and not denied, all attributes are allowed
            this._.attributes = this._.attributes ? utils_1.default.toStringArray(this._.attributes) : ['*'];
        }
        utils_1.default.commitToGrants(this._grants, this._, false);
        // important: reset attributes for chained methods
        this._.attributes = undefined;
        return this;
    };
    return Access;
}());
exports.default = Access;
//# sourceMappingURL=Access.js.map