// create table public.yudarlinn_stream
// (
//     stream_id        text not null
//         constraint yudarlinn_stream_pk
//             primary key,
//     title            text,
//     category_id      integer,
//     category_name    varchar(64),
//     is_live          boolean,
//     m3u8_address     text,
//     storage_provider varchar(10) default 'r2'::character varying,
//     download_address text,
//     start_at         timestamp with time zone,
//     end_at           timestamp with time zone
// );

import { Column, Model, Table } from 'sequelize-typescript';

// comment on table public.yudarlinn_stream is '유달린 생방송';

// comment on column public.yudarlinn_stream.stream_id is '스트림 ID';

// comment on column public.yudarlinn_stream.title is '방송 제목';

// comment on column public.yudarlinn_stream.is_live is '현재 생방송 중 여부';

// comment on column public.yudarlinn_stream.m3u8_address is 'm3u8 주소';

// comment on column public.yudarlinn_stream.download_address is '다운로드 주소';

// comment on column public.yudarlinn_stream.end_at is '종료일시';

// alter table public.yudarlinn_stream
//     owner to postgres;

// create index yudarlinn_stream_end_at_index
//     on public.yudarlinn_stream (end_at);

// create index yudarlinn_stream_start_at_index
//     on public.yudarlinn_stream (start_at);

// create index yudarlinn_stream_stream_id_index
//     on public.yudarlinn_stream (stream_id);

// create index yudarlinn_stream_title_index
//     on public.yudarlinn_stream (title);

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_stream to anon;

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_stream to authenticated;

// grant delete, insert, references, select, trigger, truncate, update on public.yudarlinn_stream to service_role;

@Table({
  tableName: 'yudarlinn_stream',
  comment: '유달린 생방송',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class YudarlinnStream extends Model<YudarlinnStream> {
  @Column({
    field: 'stream_id',
    primaryKey: true,
    comment: '스트림 ID',
  })
  streamId: string;

  @Column({
    field: 'title',
    comment: '방송 제목',
  })
  title: string;

  @Column({
    field: 'category_id',
    comment: '카테고리 ID',
  })
  categoryId: number;

  @Column({
    field: 'category_name',
    comment: '카테고리 이름',
  })
  categoryName: string;

  @Column({
    field: 'is_live',
    comment: '현재 생방송 중 여부',
  })
  isLive: boolean;

  @Column({
    field: 'm3u8_address',
    comment: 'm3u8 주소',
  })
  m3u8Address: string;

  @Column({
    field: 'storage_provider',
    comment: '저장소 제공자',
  })
  storageProvider: string;

  @Column({
    field: 'download_address',
    comment: '다운로드 주소',
  })
  downloadAddress: string;

  @Column({
    field: 'start_at',
    comment: '시작일시',
  })
  startAt: Date;

  @Column({
    field: 'end_at',
    comment: '종료일시',
  })
  endAt: Date;
}
