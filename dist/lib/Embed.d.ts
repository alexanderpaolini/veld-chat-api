declare type EmbedAuthor = {
    value: string;
    iconUrl: string;
};
declare class Embed {
    embed: {
        author?: EmbedAuthor;
        title?: string;
        description?: string;
        color?: number;
        footer?: string;
        imageUrl?: string;
        thumbnailUrl?: string;
    };
    constructor();
    setTitle(title: string): this;
    setDescription(description: string): this;
    addField(name: string, value: string): this;
    setAuthor(value: string, url: string): this;
    setFooter(value: string): this;
    setColor(value: number): this;
    setImage(value: string): this;
    setThumbnail(value: string): this;
    parse(): {
        embed: {
            author?: EmbedAuthor;
            title?: string;
            description?: string;
            color?: number;
            footer?: string;
            imageUrl?: string;
            thumbnailUrl?: string;
        };
    };
}
export default Embed;
