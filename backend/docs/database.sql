-- CREAR TABLA DE USUARIOS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREAR TABLA DE PROPIEDADES
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  property_id INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- migrations/create_reviews.sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Un usuario solo puede reseñar una vez por booking
  UNIQUE (booking_id, user_id)
);

//Agregar estas columnas en la tabla properties.
ALTER TABLE properties ADD COLUMN city TEXT;
ALTER TABLE properties ADD COLUMN lat NUMERIC;
ALTER TABLE properties ADD COLUMN lng NUMERIC;
ALTER TABLE properties ADD COLUMN image TEXT;