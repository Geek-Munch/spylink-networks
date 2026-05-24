import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spylink_api.settings')
django.setup()

from products.models import Category, Product

# Clear existing products (optional - uncomment if you want fresh start)
# Product.objects.all().delete()
# print("Cleared existing products")

# Get or create categories
categories = {}

category_names = [
    ('Routers', 'routers', 'High-performance routers for home and business'),
    ('Switches', 'switches', 'Network switches for better connectivity'),
    ('Access Points', 'access-points', 'WiFi access points for extended coverage'),
    ('Cables & Connectors', 'cables-connectors', 'VGA, HDMI, USB, and other connectivity cables'),
    ('Networking Tools', 'networking-tools', 'Crimping tools, testers, and installation equipment'),
    ('CCTV & Security', 'cctv-security', 'Cameras, switches, power supplies for surveillance'),
    ('Power & Adapters', 'power-adapters', 'Power supplies, adapters, and POE injectors'),
    ('Laptop Accessories', 'laptop-accessories', 'Bags, stands, sleeves, and cooling pads'),
    ('Computer Peripherals', 'computer-peripherals', 'Keyboards, mice, and input devices'),
    ('Adapters & Converters', 'adapters-converters', 'HDMI to VGA, USB to LAN, type C adapters'),
    ('Mounts & Cabinets', 'mounts-cabinets', 'Wall mounts, server cabinets, and enclosures'),
    ('Cables Bulk', 'cables-bulk', 'Bulk network cables and accessories'),
    ('Connectors', 'connectors', 'RJ45 connectors, couplers, and faceplates'),
    ('Video Cables', 'video-cables', 'HDMI, VGA, DVI video cables'),
    ('USB Devices', 'usb-devices', 'USB hubs, adapters, and extensions'),
    ('Audio Cables', 'audio-cables', 'Stereo and audio cables'),
]

for name, slug, desc in category_names:
    cat, created = Category.objects.get_or_create(
        slug=slug,
        defaults={'name': name, 'description': desc}
    )
    categories[slug] = cat
    print(f"{'Created' if created else 'Found'}: {name}")

# Complete product list
all_products = []

# ============ EXISTING ROUTERS & SWITCHES ============
all_products.extend([
    {'name': 'TP-Link Archer AX73', 'cat': 'routers', 'price': 12999, 'stock': 15, 'desc': 'AX5400 Dual-Band Wi-Fi 6 Router, covers up to 2,500 sq ft', 'featured': True},
    {'name': 'Google Nest WiFi Pro', 'cat': 'routers', 'price': 24999, 'stock': 5, 'desc': 'WiFi 6E mesh system, covers up to 2,200 sq ft', 'featured': True},
    {'name': 'MikroTik hAP ac2', 'cat': 'routers', 'price': 8999, 'stock': 12, 'desc': 'Powerful dual-band router with advanced configuration', 'featured': False},
    {'name': 'Ubiquiti UniFi U6-LR', 'cat': 'access-points', 'price': 18999, 'stock': 8, 'desc': 'Long-range WiFi 6 access point', 'featured': True},
    {'name': 'TP-Link 8-Port Gigabit Switch', 'cat': 'switches', 'price': 3499, 'stock': 25, 'desc': '8-Port Gigabit Unmanaged Switch', 'featured': False},
    {'name': 'Ubiquiti EdgeSwitch 24-Port', 'cat': 'switches', 'price': 34999, 'stock': 3, 'desc': '24-port managed Gigabit switch', 'featured': False},
])

# ============ VGA CABLES ============
vga_cables = [
    ('VGA Cable 1.5m M/M', 75, 100, 'Male to Male VGA cable 1.5 meters'),
    ('VGA Cable 3m M/M', 130, 100, 'Male to Male VGA cable 3 meters'),
    ('VGA Cable 5m M/M', 280, 80, 'Male to Male VGA cable 5 meters'),
    ('VGA Cable 10m M/M', 420, 60, 'Male to Male VGA cable 10 meters'),
    ('VGA Cable 15m M/M', 700, 40, 'Male to Male VGA cable 15 meters'),
    ('VGA Cable 20m M/M', 800, 30, 'Male to Male VGA cable 20 meters'),
    ('VGA Cable 25m M/M', 1000, 20, 'Male to Male VGA cable 25 meters'),
    ('VGA Cable 30m M/M', 1200, 15, 'Male to Male VGA cable 30 meters'),
]
for name, price, stock, desc in vga_cables:
    all_products.append({'name': name, 'cat': 'video-cables', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ HDMI CABLES ============
hdmi_cables = [
    ('HDMI to HDMI Cable 1.5m', 80, 200, 'HDMI 1.4 cable 1.5 meters'),
    ('HDMI to HDMI Cable 3m', 160, 150, 'HDMI 1.4 cable 3 meters'),
    ('HDMI to HDMI Cable 5m', 270, 120, 'HDMI 1.4 cable 5 meters'),
    ('HOMI to DVI Cable 1.5m', 180, 50, 'HDMI to DVI adapter cable'),
]
for name, price, stock, desc in hdmi_cables:
    all_products.append({'name': name, 'cat': 'video-cables', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ USB CABLES ============
usb_cables = [
    ('USB Printer Cable 1.5m', 70, 150, 'USB 2.0 printer cable'),
    ('USB Printer Cable 3m', 150, 100, 'USB 2.0 printer cable'),
    ('USB Printer Cable 5m', 250, 80, 'USB 2.0 printer cable'),
    ('USB Printer Cable 10m', 400, 50, 'USB 2.0 printer cable'),
    ('USB Extension Cable 1.5m', 70, 120, 'USB extension cable'),
    ('USB Extension Cable 3m', 150, 100, 'USB extension cable'),
    ('USB Extension Cable 5m', 250, 80, 'USB extension cable'),
    ('USB Extension Cable 10m Heavy', 550, 40, 'Heavy duty USB extension'),
    ('USB to USB Cable A to A 1.2m', 60, 100, 'USB A to A cable'),
]
for name, price, stock, desc in usb_cables:
    all_products.append({'name': name, 'cat': 'usb-devices', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ BULK CAT6 CABLES ============
bulk_cables = [
    ('Cat6 Cable 305m Indoor PASS Fluke', 7500, 20, 'Cat6 305m cable - Fluke tested'),
    ('Cat6 Cable 305m Indoor Full Copper', 10500, 15, 'Cat6 305m pure copper'),
    ('Cat6 Cable 305m Outdoor', 5600, 25, 'Cat6 305m outdoor rated'),
]
for name, price, stock, desc in bulk_cables:
    all_products.append({'name': name, 'cat': 'cables-bulk', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ PATCH CABLES ============
patch_cables = [
    ('Patch Code Cat7 0.5m Black', 120, 100, 'Cat7 patch cable'),
    ('Patch Code Cat7 1.5m Black', 350, 80, 'Cat7 patch cable'),
    ('Patch Code Cat6 1m Grey', 75, 150, 'Cat6 patch cable'),
    ('Patch Code Cat6 2m Grey', 85, 150, 'Cat6 patch cable'),
    ('Patch Code Cat6 3m Grey', 100, 140, 'Cat6 patch cable'),
    ('Patch Code Cat6 5m Grey', 130, 120, 'Cat6 patch cable'),
    ('Patch Code Cat6 10m Grey', 230, 100, 'Cat6 patch cable'),
    ('Patch Code Cat6 15m Grey', 300, 80, 'Cat6 patch cable'),
    ('Patch Code Cat6 20m Grey', 400, 60, 'Cat6 patch cable'),
    ('Patch Code Cat6 30m Grey', 500, 50, 'Cat6 patch cable'),
    ('Patch Code Cat6 40m Grey', 600, 40, 'Cat6 patch cable'),
    ('Patch Code Cat6 50m Grey', 700, 30, 'Cat6 patch cable'),
]
for name, price, stock, desc in patch_cables:
    all_products.append({'name': name, 'cat': 'cables-connectors', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ CONNECTORS ============
connectors = [
    ('Cat6 RJ45 Connector', 2.50, 5000, 'Cat6 RJ45 connector'),
    ('Cat6 RJ45 Stefl Connector', 4, 3000, 'Cat6 RJ45 Stefl connector'),
    ('Cat7 RJ45 Connector', 30, 1000, 'Cat7 RJ45 connector'),
    ('RJ45 Cap Boot Gray', 1, 2000, 'RJ45 boot cap'),
    ('Coupler 1+1', 25, 500, 'RJ45 coupler 1+1'),
    ('Coupler 1+2', 30, 400, 'RJ45 coupler 1+2'),
    ('Coupler 3+1 Black', 70, 300, 'RJ45 coupler 3+1'),
    ('Cat6 ID Module', 80, 200, 'Keystone jack Cat6'),
    ('Faceplate Single Cat6', 65, 150, 'Single port faceplate'),
    ('Faceplate Double Cat6', 65, 150, 'Double port faceplate'),
]
for name, price, stock, desc in connectors:
    all_products.append({'name': name, 'cat': 'connectors', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ TOOLS ============
tools = [
    ('Crimping Tool Heavy Blue', 900, 50, 'Heavy duty crimping tool'),
    ('Crimping Tool Jakemy JM-CT4-3', 500, 40, 'Jakemy crimping tool'),
    ('Crimping Tool 568', 450, 60, 'Crimping tool model 568'),
    ('LAN Tester Plug and Play', 450, 35, 'Cable tester plug and play'),
    ('LAN Tester Middle Quality', 400, 40, 'Cable tester'),
    ('LAN Tester Professional', 2000, 20, 'Professional cable tester'),
    ('Wire Tracker AR-868', 2000, 15, 'Wire tracker tool'),
    ('Punching Tool', 3000, 10, 'Professional punch down tool'),
    ('Networking Tool Kit Yellow', 1500, 20, 'Complete networking tool kit'),
    ('Patch Panel 24 Port', 1800, 30, '24 port patch panel'),
    ('Patch Panel 48 Port', 3500, 20, '48 port patch panel'),
    ('Cable Manager 1U', 550, 40, '1U cable manager'),
    ('Cable Manager 2U Plastic', 500, 35, '2U plastic cable manager'),
]
for name, price, stock, desc in tools:
    all_products.append({'name': name, 'cat': 'networking-tools', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ POWER ADAPTERS ============
power = [
    ('Power Adapter 12V 1A', 160, 100, '12V 1A power adapter'),
    ('Power Adapter 12V 2A', 200, 100, '12V 2A power adapter'),
    ('Power Adapter 12V 3A', 300, 80, '12V 3A power adapter'),
    ('Power Adapter 12V 5A', 400, 70, '12V 5A power adapter'),
    ('POE Adapter 48V 0.5A', 350, 50, '48V POE injector'),
    ('USB to LAN 3.0', 700, 60, 'USB 3.0 to Ethernet adapter'),
    ('Type C to LAN', 700, 50, 'Type C to Ethernet adapter'),
]
for name, price, stock, desc in power:
    all_products.append({'name': name, 'cat': 'power-adapters', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ CCTV & SECURITY ============
cctv = [
    ('4 Port POE Switch', 3200, 30, '4 port POE switch for CCTV'),
    ('6 Port Gigabit POE Switch', 4400, 25, '6 port Gigabit POE switch'),
    ('12 Port Gigabit POE Switch', 12500, 15, '12 port Gigabit POE switch'),
    ('5 Port Switch', 600, 50, '5 port normal switch'),
    ('8 Port Switch', 750, 45, '8 port normal switch'),
    ('CCTV Power Supply 12V 5A', 1000, 40, '12V 5A CCTV power supply'),
    ('CCTV Power Supply 12V 10A', 1550, 35, '12V 10A CCTV power supply'),
    ('4 Channel Power Supply', 800, 50, '4 channel CCTV power supply'),
    ('8 Channel Power Supply', 1000, 40, '8 channel CCTV power supply'),
    ('16 Channel Power Supply', 1200, 30, '16 channel CCTV power supply'),
]
for name, price, stock, desc in cctv:
    all_products.append({'name': name, 'cat': 'cctv-security', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ COMPUTER PERIPHERALS ============
peripherals = [
    ('HP Original M10 Mouse', 400, 80, 'HP original wired mouse'),
    ('USB Wired Mouse M20', 140, 100, 'Wired USB mouse'),
    ('Wireless Mouse 267', 280, 70, 'Wireless mouse'),
    ('Bluetooth Rechargeable Mouse', 320, 60, 'Bluetooth rechargeable mouse'),
    ('HP Wireless Mouse S500', 650, 40, 'HP wireless mouse'),
    ('Logitech G102 Gaming Mouse', 300, 50, 'Logitech gaming mouse'),
    ('USB Keyboard Antlop', 320, 60, 'Wired USB keyboard'),
    ('Wireless Combo HK-6800', 1000, 30, 'Wireless keyboard and mouse combo'),
]
for name, price, stock, desc in peripherals:
    all_products.append({'name': name, 'cat': 'computer-peripherals', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ ADAPTERS & CONVERTERS ============
adapters = [
    ('HDMI to VGA with Audio', 300, 80, 'HDMI to VGA converter with audio'),
    ('VGA to HDMI Converter', 600, 60, 'VGA to HDMI converter box'),
    ('DisplayPort to HDMI', 300, 50, 'DisplayPort to HDMI adapter'),
    ('USB to HDMI 3.0', 850, 40, 'USB 3.0 to HDMI adapter'),
    ('Type C to HDMI+VGA', 1000, 35, 'Type C multiport adapter'),
    ('Type C to VGA', 650, 45, 'Type C to VGA adapter'),
]
for name, price, stock, desc in adapters:
    all_products.append({'name': name, 'cat': 'adapters-converters', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ LAPTOP ACCESSORIES ============
laptop = [
    ('Laptop Bag India Quality', 600, 50, 'Fabric laptop bag'),
    ('Laptop Bag Heavy 615', 1800, 30, 'Heavy duty laptop bag'),
    ('Laptop Sleeve 14"', 250, 60, '14 inch laptop sleeve'),
    ('Laptop Sleeve 15.6"', 270, 55, '15.6 inch laptop sleeve'),
    ('Laptop Stand with Fan', 1200, 40, 'Cooling pad with fan'),
    ('Laptop Stand Aluminium', 800, 50, 'Aluminum laptop stand'),
]
for name, price, stock, desc in laptop:
    all_products.append({'name': name, 'cat': 'laptop-accessories', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# ============ MOUNTS & CABINETS ============
mounts = [
    ('Wall Mount 14-42" Fixed', 150, 60, 'Fixed TV wall mount'),
    ('Wall Mount 26-63" Fixed', 300, 50, 'Fixed TV wall mount large'),
    ('Wall Mount 15-42" Adjustable', 500, 40, 'Tilting TV wall mount'),
    ('Cabinet 4U with Fan', 4700, 20, '4U server cabinet'),
    ('Cabinet 6U with Fan', 6500, 15, '6U server cabinet'),
    ('Cabinet 9U with Fan', 8200, 12, '9U server cabinet'),
    ('Cabinet 12U', 11000, 10, '12U server cabinet'),
]
for name, price, stock, desc in mounts:
    all_products.append({'name': name, 'cat': 'mounts-cabinets', 'price': price, 'stock': stock, 'desc': desc, 'featured': False})

# Add all products
print("\n" + "="*60)
print("Adding products...")
print("="*60)

added = 0
for p in all_products:
    cat = categories[p['cat']]
    slug = p['name'].lower().replace(' ', '-').replace('/', '-').replace('"', '').replace('.', '').replace('+', 'plus')
    
    product, created = Product.objects.get_or_create(
        slug=slug,
        defaults={
            'name': p['name'],
            'category': cat,
            'description': p['desc'],
            'price': p['price'],
            'stock': p['stock'],
            'specifications': {'type': p['cat'].replace('-', ' ').title()},
            'is_active': True,
            'is_featured': p.get('featured', False)
        }
    )
    if created:
        added += 1
        print(f"✓ Added: {p['name']} - KES {p['price']}")

print("="*60)
print(f"✅ Successfully added {added} products")
print(f"📊 Total products in database: {Product.objects.count()}")