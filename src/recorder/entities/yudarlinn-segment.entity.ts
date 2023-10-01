// create table public.yudarlinn_segment
// (
//     id             serial
//         constraint yudarlinn_segment_pk
//             primary key,
//     stream_id      text,
//     segment_id     text,
//     segment_length integer,
//     link           text,
//     created_at     timestamp with time zone
// );

import { Column, Model, Table } from 'sequelize-typescript';

// comment on table public.yudarlinn_segment is '유달린 Stream Segment';

// alter table public.yudarlinn_segment
//     owner to postgres;

// grant select, update, usage on sequence public.yudarlinn_segment_id_seq to anon;

// grant select, update, usage on sequence public.yudarlinn_segment_id_seq to authenticated;

// grant select, update, usage on sequence public.yudarlinn_segment_id_seq to service_role;

// create index yudarlinn_segment_created_at_index
//     on public.yudarlinn_segment (created_at);

// create index yudarlinn_segment_id_index
//     on public.yudarlinn_segment (id);

// create index yudarlinn_segment_segment_id_index
//     on public.yudarlinn_segment (segment_id);

// create index yudarlinn_segment_stream_id_index
//     on public.yudarlinn_segment (stream_id);

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_segment to anon;

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_segment to authenticated;

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_segment to service_role;

@Table({
  tableName: 'yudarlinn_segment',
  comment: '유달린 Stream Segment',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class YudarlinnSegment extends Model<YudarlinnSegment> {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    comment: '유달린 Stream ID',
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
    // 소수점
    type: 'DECIMAL(10, 6)',
  })
  segmentLength: number;

  @Column({
    field: 'segment_number',
    comment: 'Segment Number',
  })
  segmentNumber: number;

  @Column({
    field: 'link',
    comment: 'Link',
  })
  link: string;
}
