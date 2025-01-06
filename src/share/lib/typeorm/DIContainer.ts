/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  dataSource,
  syncDataSource,
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

class DIContainer {
  private static repositories: Map<string, Repository<ObjectLiteral>> =
    new Map();

  private static services: Map<string, ObjectLiteral> = new Map();

  static getRepository<Entity extends Class>(entity: Entity) {
    if (!DIContainer.repositories.has(entity.name)) {
      DIContainer.repositories.set(
        entity.name,
        // getRepository를 호출하는 service에서는 무조건 dataSource를 호출하게 된다
        syncDataSource!.getRepository(entity)
      );
    }
    return DIContainer.repositories.get(entity.name) as Repository<Entity>;
  }

  static setService<T extends ObjectLiteral>(
    constructor: new (...args: any[]) => T
  ) {
    if (!DIContainer.services.has(constructor.name)) {
      DIContainer.services.set(
        constructor.name,
        setAsyncAllMethod(new constructor())
      );
    }
  }

  static getService<Service extends ObjectLiteral>(
    constructor: new (...args: any[]) => Service
  ) {
    if (!DIContainer.services.has(constructor.name)) {
      DIContainer.services.set(constructor.name, new constructor());
    }
    return DIContainer.services.get(constructor.name) as Service;
  }
}

export function Service(constructor: new (...args: any[]) => any) {
  // @Service  데코레이션,  Provider 에  해등 클래스가 스캔되면 등록된다
  DIContainer.setService(constructor);
}

export function Inject<Entity extends Class>(entity: Entity) {
  return (target: ObjectLiteral, filedName: string) => {
    Object.defineProperty(target, filedName, {
      writable: false,
      value: DIContainer.getService(entity),
    });
  };
}

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
