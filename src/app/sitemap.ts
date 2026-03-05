import { MetadataRoute } from 'next';
import { ALGORITHMS } from '@/data/algorithms';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://algolab.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const algorithmRoutes: MetadataRoute.Sitemap = ALGORITHMS.map(a => ({
    url: `${base}/algorithms/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...algorithmRoutes];
}
