/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityInterface } from "@/entity/interface/EntityInterface";
import {
  dataSource,
  originDataSource,
} from "@/share/lib/typeorm/app-data-source";
import { ObjectLiteral, Repository } from "typeorm";

interface Class {
  new (...args: any[]): any;
}

const setAsyncAllMethod = (target: any) => {
  return new Proxy(target, {
    get: (target, key) => {
      const value = target[key];
      if (typeof value === "function") {
        return async (...args: any[]) => {
          await dataSource();
          return value.call(target, ...args);
        };
      }

      return value;
    },
  });
};

export class DIContainer {
  private static repositories: Map<string, Repository<ObjectLiteral>> =
    new Map();

  private static services: Map<Function, ObjectLiteral> = new Map();

  static getRepository<Entity extends Class>(entity: Entity) {
    if (!DIContainer.repositories.has(entity.name)) {
      DIContainer.repositories.set(
        entity.name,
        // getRepository를 호출하는 service에서는 무조건 dataSource를 호출하게 된다
        originDataSource!.getRepository(entity)
      );
    }
    return DIContainer.repositories.get(entity.name) as Repository<Entity>;
  }

  static setService<Service extends EntityInterface>(
    constructor: new (...args: any[]) => Service
  ) {
    if (!DIContainer.services.has(constructor)) {
      DIContainer.services.set(
        constructor,
        setAsyncAllMethod(new constructor())
      );
    }
  }

  static getService<Service>(_constructor: new (...args: any[]) => Service) {
    return DIContainer.services.get(_constructor) as Service;
  }
}

export function Service(_key: string) {
  // @Service  데코레이션,  Provider 에  해등 클래스가 스캔되면 등록된다

  return (constructor: new (...args: any[]) => any) => {
    DIContainer.setService(constructor);
  };
}

// export function Inject<Entity extends Class>(entity: Entity) {
//   return (target: ObjectLiteral, filedName: string) => {
//     Object.defineProperty(target, filedName, {
//       writable: false,
//       value: DIContainer.getService(entity),
//     });
//   };
// }

export function InjectRepository<Entity extends Class>(entity: Entity) {
  return (target: ObjectLiteral, filedName: string) => {
    Object.defineProperty(target, filedName, {
      writable: false,
      value: DIContainer.getRepository(entity),
    });
  };
}

export const getService = DIContainer.getService;
export const getRepository = DIContainer.getRepository;
export interface IService<T extends ObjectLiteral> {
  getRepository: () => Promise<Repository<T>>;
}
