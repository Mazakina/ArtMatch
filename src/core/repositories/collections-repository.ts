export abstract class CollectionsRepository {
  createCollection: (userId: string, collectionData: any) => Promise<void>;
  getCollectionById: (collectionId: string) => Promise<any | null>;
  updateCollection: (
    collectionId: string,
    collectionData: any
  ) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  getAllCollectionsByUserId: (
    userId: string,
    options?: { skip?: number; take?: number }
  ) => Promise<any[]>;
}
