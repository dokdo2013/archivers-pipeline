// create table public.segment
// (
//     id             serial
//         primary key,
//     stream_id      varchar(255),
//     segment_id     varchar(255),
//     segment_length numeric(10, 6),
//     link           varchar(255),
//     created_at     timestamp with time zone not null,
//     updated_at     timestamp with time zone not null
// );

// comment on table public.segment is '유달린 Stream Segment';

// comment on column public.segment.id is '유달린 Stream ID';

// comment on column public.segment.stream_id is 'Stream ID';

// comment on column public.segment.segment_id is 'Segment ID';

// comment on column public.segment.segment_length is 'Segment Length';

// comment on column public.segment.link is 'Link';

// alter table public.segment
//     owner to postgres;

// create index segment_created_at_index
//     on public.segment (created_at);

// create index segment_link_index
//     on public.segment (link);

// create index segment_segment_id_index
//     on public.segment (segment_id);

// create index segment_stream_id_index
//     on public.segment (stream_id);

import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'segment',
  comment: 'Stream Segment',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Segment extends Model<Segment> {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    comment: 'Stream ID',
  })
  id: number;

  @Column({
    field: 'stream_id',
    comment: 'Stream ID',
  })
  streamId: string;

  @Column({
    field: 'segment_id',
    comment: 'Segment ID',
  })
  segmentId: string;

  @Column({
    field: 'segment_length',
    comment: 'Segment Length',
  })
  segmentLength: number;

  @Column({
    field: 'link',
    comment: 'Link',
  })
  link: string;
}
