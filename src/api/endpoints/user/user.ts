/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Shoppe example
 * The shop API description
 * OpenAPI spec version: 1.0
 */
import { api } from '../../../../lib/api';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getUser = () => {
  const userControllerFindAll = (options?: SecondParameter<typeof api>) => {
    return api<void>(
      { url: `http://localhost:3001/api/v1/users`, method: 'GET' },
      options,
    );
  };
  const userControllerFindOneById = (
    id: string,
    options?: SecondParameter<typeof api>,
  ) => {
    return api<void>(
      { url: `http://localhost:3001/api/v1/users/${id}`, method: 'GET' },
      options,
    );
  };
  const userControllerDelete = (
    id: string,
    options?: SecondParameter<typeof api>,
  ) => {
    return api<void>(
      { url: `http://localhost:3001/api/v1/users/${id}`, method: 'DELETE' },
      options,
    );
  };
  return {
    userControllerFindAll,
    userControllerFindOneById,
    userControllerDelete,
  };
};
export type UserControllerFindAllResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUser>['userControllerFindAll']>>
>;
export type UserControllerFindOneByIdResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUser>['userControllerFindOneById']>>
>;
export type UserControllerDeleteResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUser>['userControllerDelete']>>
>;
