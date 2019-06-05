/**
 *
 *
 * @export
 * @interface IStage
 */
export interface IStage {
    id: string;
    url?: string;
    swagger_url?: string;
    deployed: boolean;
    healthStatus?: boolean;
}