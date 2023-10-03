// create table public.streamer
// (
//     id                  serial
//         constraint streamer_pk
//             primary key,
//     twitch_id           integer,
//     twitch_name         varchar(64),
//     twitch_display_name varchar(64),
//     profile_image_url   text,
//     subscribe_start     timestamp with time zone,
//     subscribe_end       timestamp with time zone,
//     memo                text,
//     issuer_id           integer,
//     created_at          timestamp with time zone default CURRENT_TIMESTAMP,
//     updated_at          timestamp with time zone default CURRENT_TIMESTAMP,
//     deleted_at          timestamp with time zone
// );

// comment on table public.streamer is '녹화대상 스트리머';

// comment on column public.streamer.twitch_id is 'Twitch user id';

// comment on column public.streamer.twitch_name is 'Twitch user name';

// comment on column public.streamer.twitch_display_name is 'Twitch Display Name';

// comment on column public.streamer.profile_image_url is 'profile image url';

// alter table public.streamer
//     owner to postgres;

// create index streamer_created_at_index
//     on public.streamer (created_at);

// create index streamer_subscribe_start_index
//     on public.streamer (subscribe_start);

// create index streamer_twitch_display_name_index
//     on public.streamer (twitch_display_name);

// create index streamer_twitch_id_index
//     on public.streamer (twitch_id);

// create index streamer_twitch_name_index
//     on public.streamer (twitch_name);

import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'streamer',
  comment: '녹화대상 스트리머',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Streamer extends Model<Streamer> {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    comment: '스트리머 ID',
  })
  id: number;

  @Column({
    field: 'twitch_id',
    comment: 'Twitch user id',
  })
  twitchId: number;

  @Column({
    field: 'twitch_name',
    comment: 'Twitch user name',
  })
  twitchName: string;

  @Column({
    field: 'twitch_display_name',
    comment: 'Twitch Display Name',
  })
  twitchDisplayName: string;

  @Column({
    field: 'profile_image_url',
    comment: 'profile image url',
  })
  profileImageUrl: string;

  @Column({
    field: 'subscribe_start',
    comment: '구독 시작일',
  })
  subscribeStart: Date;

  @Column({
    field: 'subscribe_end',
    comment: '구독 종료일',
  })
  subscribeEnd: Date;

  @Column({
    field: 'memo',
    comment: '메모',
  })
  memo: string;

  @Column({
    field: 'issuer_id',
    comment: '생성자',
  })
  issuerId: number;
}
