"use server"
import { createAccessToken } from "app/utils/auth/createAccessToken"
import { validateAccessToken } from "app/utils/auth/validateAccessToken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from 'bcryptjs';
import redis from "app/utils/auth/redis"
import { NextApiRequest, NextApiResponse } from 'next';
import { getPayments } from 'app/services/mongo/consulta';

export const handleCreateUser = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData);
  delete formDataObject["password_confirmation"];
  

  // Hash the password
  const hashedPassword = await bcrypt.hash(formDataObject.password as string, 10);
  
  // Prepare user data
  const userData = {
    ...formDataObject,
    phone: '+57' + formDataObject.phone,
    password: hashedPassword
  };

  // Save user data in Redis
  const userKey = `user:${formDataObject.email}`;
  await redis.hmset(userKey, userData);

  // Create access token and set the cookie
  await createAccessToken(formDataObject.email as string, formDataObject.password as string);
  
  // Redirect to payment
  redirect('/payment')
};

export const handleLogin = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData);
  const email = formDataObject.email as string;
  const password = formDataObject.password as string;

  // Obtener los datos del usuario desde Redis
  const userKey = `user:${email}`;
  const user = await redis.hgetall(userKey);

  if (!user) {
    throw new Error('User not found');
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Crear el token de acceso
  const accessToken = await createAccessToken(email, password);

  if (accessToken) {
    console.log('entre');
    
    // Redirigir a la página de la tienda
    redirect('/payment')
  }
};

export const handleLogOut = async () => {
  const cookiepayment = cookies();
  const accessToken = cookiepayment.get('accessToken')?.value || '';

  if (accessToken) {
    // Eliminar el token de Redis
    await redis.del(`token:${accessToken}`);

    // Borrar la cookie del cliente
    cookiepayment.set('accessToken', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  // Redirigir al usuario a la página de inicio de sesión u otra página adecuada
  redirect('/login');
};

export default async function handlerQuery(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    const payments = await getPayments(userId as string);

    return res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

