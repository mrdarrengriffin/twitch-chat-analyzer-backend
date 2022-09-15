export interface INewTwitchChannel {
    id: number;
    login: string;
    display_name: string;
    type: string;
    is_live: boolean;
    broadcaster_type: string;
    description: string
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: Date;
}

export interface INewTwitchChannelStreamerIdentifiers {
    id?: number;
    username?: string;
}
export interface TwitchChannel {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: Date;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
}
