export const serializeObjects = (items: any[]) => {
  return items.map(item => ({ 
    ...item,
    image_url: `http://10.0.0.100:3333/uploads/${item.image}`
  }))
}

export function getEnvPath(envName:string) {
  const envs: any = {
    prod: '.env',
    dev: '.env.dev',
    test: '.env.test'
  };

  return envs[envName];
}