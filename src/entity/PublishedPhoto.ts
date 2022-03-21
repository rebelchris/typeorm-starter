import { Connection, ViewColumn, ViewEntity } from 'typeorm';
import {Photo} from "./Photo";

@ViewEntity({
    expression: (connection: Connection) =>
        connection
            .createQueryBuilder()
            .select('*')
            .from(Photo, 'photo')
            .where('photo.isPublished = true')
})

export class PublishedPhoto {
    @ViewColumn()
    id: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    views: number;
}
