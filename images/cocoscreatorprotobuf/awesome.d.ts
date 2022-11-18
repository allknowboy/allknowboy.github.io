import * as $protobuf from "protobufjs";
/** Properties of an AwesomeMessage. */
export interface IAwesomeMessage {

    /** AwesomeMessage name */
    name?: (string|null);
}

/** Represents an AwesomeMessage. */
export class AwesomeMessage implements IAwesomeMessage {

    /**
     * Constructs a new AwesomeMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAwesomeMessage);

    /** AwesomeMessage name. */
    public name: string;

    /**
     * Creates a new AwesomeMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AwesomeMessage instance
     */
    public static create(properties?: IAwesomeMessage): AwesomeMessage;

    /**
     * Encodes the specified AwesomeMessage message. Does not implicitly {@link AwesomeMessage.verify|verify} messages.
     * @param message AwesomeMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link AwesomeMessage.verify|verify} messages.
     * @param message AwesomeMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AwesomeMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AwesomeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AwesomeMessage;

    /**
     * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AwesomeMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AwesomeMessage;

    /**
     * Verifies an AwesomeMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AwesomeMessage
     */
    public static fromObject(object: { [k: string]: any }): AwesomeMessage;

    /**
     * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
     * @param message AwesomeMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AwesomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AwesomeMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
