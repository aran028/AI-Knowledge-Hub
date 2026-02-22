## 🚀 Instrucciones para Conectar Supabase Database

### 📋 Checklist de Configuración

1. **Obtener Credenciales de Supabase**
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto
   - Ve a Settings > API
   - Copia las credenciales:
     - Project URL
     - anon public key
     - service_role secret key (¡importante!)

2. **Actualizar .env.local**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=TU_PROJECT_URL_AQUI
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
   SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI
   ```

3. **Crear Tablas en Supabase**
   - Ve a tu Supabase Dashboard
   - Abre SQL Editor
   - Ejecuta el contenido completo de: `scripts/create-tables.sql`

4. **Verificar Conexión**
   ```bash
   npm run db:setup
   ```

5. **Poblar con Datos Iniciales** (opcional)
   ```bash
   npm run db:seed
   ```

### 🔧 Comandos Disponibles

- `npm run db:setup` - Verifica conexión y estructura de BD
- `npm run db:seed` - Carga datos iniciales de ejemplo
- `npm run db:check` - Mismo que db:setup

### 💡 Troubleshooting

- **Error de conexión**: Verifica las credenciales en .env.local
- **Tablas no existen**: Ejecuta create-tables.sql en Supabase Dashboard  
- **Permisos**: Asegúrate de usar el service_role key, no el anon key

¿Todo listo? Ejecuta `npm run db:setup` para verificar la conexión.