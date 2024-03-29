// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismicT from "@prismicio/types";
import type * as prismic from "@prismicio/client";

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
};
/** Content for Posts documents */
interface PostDocumentData {
    /**
     * title field in *Posts*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: post.title
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismicT.KeyTextField;
    /**
     * description field in *Posts*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: post.description
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    description: prismicT.KeyTextField;
    /**
     * mainImg field in *Posts*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: post.mainimg
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    mainimg: prismicT.ImageField<never>;
    /**
     * imageArray field in *Posts*
     *
     * - **Field Type**: Group
     * - **Placeholder**: *None*
     * - **API ID Path**: post.imagearray[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/group
     *
     */
    imagearray: prismicT.GroupField<Simplify<PostDocumentDataImagearrayItem>>;
    /**
     * published field in *Posts*
     *
     * - **Field Type**: Boolean
     * - **Placeholder**: *None*
     * - **Default Value**: false
     * - **API ID Path**: post.published
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/boolean
     *
     */
    published: prismicT.BooleanField;
    /**
     * midia field in *Posts*
     *
     * - **Field Type**: Select
     * - **Placeholder**: *None*
     * - **API ID Path**: post.midia
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/select
     *
     */
    midia: prismicT.SelectField<"1" | "2">;
    /**
     * tags field in *Posts*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: post.tags
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    tags: prismicT.KeyTextField;
    /**
     * thumbnail field in *Posts*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: post.thumbnail
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    thumbnail: prismicT.ImageField<never>;
}
/**
 * Item in Posts → imageArray
 *
 */
export interface PostDocumentDataImagearrayItem {
    /**
     * fill01 field in *Posts → imageArray*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: post.imagearray[].fill01
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    fill01: prismicT.ImageField<never>;
    /**
     * fill02 field in *Posts → imageArray*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: post.imagearray[].fill02
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    fill02: prismicT.ImageField<never>;
}
/**
 * Posts document from Prismic
 *
 * - **API ID**: `post`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PostDocument<Lang extends string = string> = prismicT.PrismicDocumentWithUID<Simplify<PostDocumentData>, "post", Lang>;
export type AllDocumentTypes = PostDocument;
declare module "@prismicio/client" {
    interface CreateClient {
        (repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
    }
    namespace Content {
        export type { PostDocumentData, PostDocumentDataImagearrayItem, PostDocument, AllDocumentTypes };
    }
}
