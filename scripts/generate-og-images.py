"""Generate OG images (1200x630) for service pages and other pages."""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'og')
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 1200, 630
BG = '#1a2744'
GOLD = '#c9a96e'
WHITE = '#ffffff'
COMPANY = 'Best Kitchen and Bathroom Remodeling'
TAGLINE = "Seattle's Top-Rated Remodeling Company"
PHONE = '(206) 666-4370'


def get_font(size):
    """Try to load a system font, fall back to default."""
    for name in ['arialbd.ttf', 'Arial Bold.ttf', 'arial.ttf', 'DejaVuSans-Bold.ttf', 'DejaVuSans.ttf']:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def slug_to_title(slug):
    return slug.replace('-', ' ').title()


def draw_centered_text(draw, text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, y), text, font=font, fill=fill)


def create_og_image(filename, title, subtitle=None):
    img = Image.new('RGB', (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Gold accent bar at top
    draw.rectangle([0, 0, W, 6], fill=GOLD)
    # Gold accent bar at bottom
    draw.rectangle([0, H - 6, W, H], fill=GOLD)

    # Decorative side lines
    draw.rectangle([40, 80, 44, H - 80], fill=GOLD + '40')
    draw.rectangle([W - 44, 80, W - 40, H - 80], fill=GOLD + '40')

    font_company = get_font(28)
    font_title = get_font(52)
    font_tagline = get_font(24)
    font_phone = get_font(22)

    # Company name
    draw_centered_text(draw, COMPANY, 100, font_company, GOLD)

    # Decorative line under company name
    line_y = 145
    draw.rectangle([(W - 200) / 2, line_y, (W + 200) / 2, line_y + 2], fill=GOLD)

    # Service title - handle long titles
    if len(title) > 30:
        font_title = get_font(42)
    draw_centered_text(draw, title, 220, font_title, WHITE)

    # Subtitle if provided
    sub = subtitle or TAGLINE
    draw_centered_text(draw, sub, 310, font_tagline, '#a0aec0')

    # Phone
    draw_centered_text(draw, PHONE, 480, font_phone, GOLD)

    # Small tagline at bottom
    font_small = get_font(18)
    draw_centered_text(draw, 'Licensed, Bonded & Insured | Seattle, WA', 530, font_small, '#6b7a94')

    out = os.path.join(OUTPUT_DIR, filename)
    img.save(out, 'PNG', optimize=True)
    print(f'  Created: {filename}')


# Service pages
services = [
    'kitchen-remodeling', 'bathroom-remodeling', 'cabinet-refacing',
    'countertop-installation', 'tile-installation', 'shower-remodeling',
    'bathtub-replacement', 'vanity-installation', 'kitchen-layout-design',
    'custom-cabinetry', 'flooring-installation', 'aging-in-place',
]

print('Generating service OG images...')
for slug in services:
    create_og_image(f'{slug}.png', slug_to_title(slug))

# Other pages
print('Generating page OG images...')
other_pages = [
    ('og-blog.png', 'Remodeling Blog', 'Tips, Trends & Inspiration'),
    ('og-reviews.png', 'Customer Reviews', '5-Star Rated Remodeling Company'),
    ('og-financing.png', 'Financing Options', 'Affordable Payment Plans Available'),
    ('og-about.png', 'About Our Company', '15+ Years of Remodeling Excellence'),
    ('og-contact.png', 'Contact Us', 'Get Your Free Estimate Today'),
    ('og-gallery.png', 'Project Gallery', 'See Our Completed Transformations'),
    ('og-cost-guides.png', 'Cost Guides', 'Transparent Pricing for Every Project'),
]

for filename, title, subtitle in other_pages:
    create_og_image(filename, title, subtitle)

print(f'\nDone! {len(services) + len(other_pages)} images generated in {OUTPUT_DIR}')
