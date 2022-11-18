/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = window.protobuf || {};

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.AwesomeMessage = (function() {

    /**
     * Properties of an AwesomeMessage.
     * @exports IAwesomeMessage
     * @interface IAwesomeMessage
     * @property {string|null} [name] AwesomeMessage name
     */

    /**
     * Constructs a new AwesomeMessage.
     * @exports AwesomeMessage
     * @classdesc Represents an AwesomeMessage.
     * @implements IAwesomeMessage
     * @constructor
     * @param {IAwesomeMessage=} [properties] Properties to set
     */
    function AwesomeMessage(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AwesomeMessage name.
     * @member {string} name
     * @memberof AwesomeMessage
     * @instance
     */
    AwesomeMessage.prototype.name = "";

    /**
     * Creates a new AwesomeMessage instance using the specified properties.
     * @function create
     * @memberof AwesomeMessage
     * @static
     * @param {IAwesomeMessage=} [properties] Properties to set
     * @returns {AwesomeMessage} AwesomeMessage instance
     */
    AwesomeMessage.create = function create(properties) {
        return new AwesomeMessage(properties);
    };

    /**
     * Encodes the specified AwesomeMessage message. Does not implicitly {@link AwesomeMessage.verify|verify} messages.
     * @function encode
     * @memberof AwesomeMessage
     * @static
     * @param {IAwesomeMessage} message AwesomeMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AwesomeMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        return writer;
    };

    /**
     * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link AwesomeMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AwesomeMessage
     * @static
     * @param {IAwesomeMessage} message AwesomeMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AwesomeMessage message from the specified reader or buffer.
     * @function decode
     * @memberof AwesomeMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AwesomeMessage} AwesomeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AwesomeMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AwesomeMessage();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AwesomeMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AwesomeMessage} AwesomeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AwesomeMessage message.
     * @function verify
     * @memberof AwesomeMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AwesomeMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        return null;
    };

    /**
     * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AwesomeMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AwesomeMessage} AwesomeMessage
     */
    AwesomeMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.AwesomeMessage)
            return object;
        var message = new $root.AwesomeMessage();
        if (object.name != null)
            message.name = String(object.name);
        return message;
    };

    /**
     * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AwesomeMessage
     * @static
     * @param {AwesomeMessage} message AwesomeMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AwesomeMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.name = "";
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        return object;
    };

    /**
     * Converts this AwesomeMessage to JSON.
     * @function toJSON
     * @memberof AwesomeMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AwesomeMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AwesomeMessage;
})();

module.exports = $root;
