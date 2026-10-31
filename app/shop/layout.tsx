import DemoBanner from '../../components/DemoBanner';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
