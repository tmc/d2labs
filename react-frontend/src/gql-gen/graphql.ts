/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  join__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export type CompletionChunk = {
  __typename?: 'CompletionChunk';
  isLast: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  diagramCompletion?: Maybe<CompletionChunk>;
  genericCompletion?: Maybe<CompletionChunk>;
  testSubscription: Scalars['String']['output'];
};


export type SubscriptionDiagramCompletionArgs = {
  prompt: Scalars['String']['input'];
};


export type SubscriptionGenericCompletionArgs = {
  prompt: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  description: Scalars['String']['output'];
  githubLogin: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum Join__Graph {
  Backend = 'BACKEND'
}

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type DiagramSubscriptionSubscriptionVariables = Exact<{
  prompt: Scalars['String']['input'];
}>;


export type DiagramSubscriptionSubscription = { __typename?: 'Subscription', diagramCompletion?: { __typename?: 'CompletionChunk', text: string, isLast: boolean } | null };

export type GenericSubscriptionSubscriptionVariables = Exact<{
  prompt: Scalars['String']['input'];
}>;


export type GenericSubscriptionSubscription = { __typename?: 'Subscription', genericCompletion?: { __typename?: 'CompletionChunk', text: string, isLast: boolean } | null };

export type DiagramSubscriptionPgSubscriptionVariables = Exact<{
  prompt: Scalars['String']['input'];
}>;


export type DiagramSubscriptionPgSubscription = { __typename?: 'Subscription', diagramCompletion?: { __typename?: 'CompletionChunk', text: string, isLast: boolean } | null };


export const DiagramSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DiagramSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diagramCompletion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}}]}}]}}]} as unknown as DocumentNode<DiagramSubscriptionSubscription, DiagramSubscriptionSubscriptionVariables>;
export const GenericSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GenericSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"genericCompletion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}}]}}]}}]} as unknown as DocumentNode<GenericSubscriptionSubscription, GenericSubscriptionSubscriptionVariables>;
export const DiagramSubscriptionPgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"DiagramSubscriptionPG"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"diagramCompletion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"isLast"}}]}}]}}]} as unknown as DocumentNode<DiagramSubscriptionPgSubscription, DiagramSubscriptionPgSubscriptionVariables>;