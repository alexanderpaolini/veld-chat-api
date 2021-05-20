import { APIEmbed } from '../types';
declare class Embed {
    embed: APIEmbed;
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
        embed: APIEmbed;
    };
}
export default Embed;
