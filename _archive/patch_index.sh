#!/bin/bash
# Run this in the bccs.bio repo directory after adding audit.html and the PDF
# It patches index.html with audit link and updated roadmap

# 1. Add Audit link to nav (before Apply)
sed -i '' 's|<a href="#apply">Apply</a>|<a href="audit.html">Audit</a>\n    <a href="#apply">Apply</a>|' index.html

# 2. Phase 2: current -> completed
sed -i '' 's|roadmap-item current"><div class="roadmap-phase">PHASE 2|roadmap-item completed"><div class="roadmap-phase">PHASE 2|' index.html

# 3. Phase 3: update class and content
sed -i '' 's|roadmap-item future"><div class="roadmap-phase">PHASE 3 &mdash; AUDIT</div><h3>Professional smart contract audit</h3><p>Contracts submitted to audit firm. Tier display active on bccs.bio. Prerequisite: contracts submitted to auditor.</p>|roadmap-item completed"><div class="roadmap-phase">PHASE 3 \&mdash; SECURITY REVIEW</div><h3>Internal security assessment completed</h3><p>KRYONIS Sovereign Systems Limited internal security review. No critical or high severity issues. Published April 15, 2026.</p>|' index.html

# 4. Phase 4: future -> current
sed -i '' 's|roadmap-item future"><div class="roadmap-phase">PHASE 4|roadmap-item current"><div class="roadmap-phase">PHASE 4|' index.html

echo "index.html patched successfully"
echo "Don't forget to: git add audit.html BCCS_Internal_Security_Review_v1.0.pdf"
echo "Then: git commit -m 'Add internal security review, update roadmap phases'"
echo "Then: git push"
