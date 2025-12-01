import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authOptions } from './auth';
import User from './db/models/User';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('./db/models/User');
vi.mock('bcryptjs');
vi.mock('./db', () => ({
    default: vi.fn(),
}));

describe('authOptions', () => {
    describe('authorize', () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123',
        };

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should return null if credentials are missing', async () => {
            // @ts-ignore - Accessing authorize directly for testing
            const result = await authOptions.providers[1].options.authorize(null, {});
            expect(result).toBeNull();
        });

        it('should return user if credentials are valid', async () => {
            const mockUser = {
                _id: 'user-id',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed-password',
                image: 'image-url',
            };

            // Mock User.findOne to return a user
            (User.findOne as any).mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser),
            });

            // Mock bcrypt.compare to return true
            (bcrypt.compare as any).mockResolvedValue(true);

            // @ts-ignore
            const result = await authOptions.providers[1].options.authorize(credentials, {});

            expect(result).toEqual({
                id: 'user-id',
                name: 'Test User',
                email: 'test@example.com',
                image: 'image-url',
            });
        });

        it('should return null if user not found', async () => {
            (User.findOne as any).mockReturnValue({
                select: vi.fn().mockResolvedValue(null),
            });

            // @ts-ignore
            const result = await authOptions.providers[1].options.authorize(credentials, {});
            expect(result).toBeNull();
        });

        it('should return null if password is invalid', async () => {
            const mockUser = {
                _id: 'user-id',
                password: 'hashed-password',
            };

            (User.findOne as any).mockReturnValue({
                select: vi.fn().mockResolvedValue(mockUser),
            });

            (bcrypt.compare as any).mockResolvedValue(false);

            // @ts-ignore
            const result = await authOptions.providers[1].options.authorize(credentials, {});
            expect(result).toBeNull();
        });
    });
});
