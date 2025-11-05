# Move contract-related files to contracts directory
# This script should be run from the root directory

# Move Hardhat config
if [ -f "hardhat.config.js" ]; then
  mv hardhat.config.js contracts/
  echo "✓ Moved hardhat.config.js to contracts/"
fi

# Move scripts directory
if [ -d "scripts" ]; then
  cp -r scripts/* contracts/scripts/ 2>/dev/null || mkdir -p contracts/scripts && cp -r scripts/* contracts/scripts/
  echo "✓ Moved scripts to contracts/"
fi

# Move test directory
if [ -d "test" ]; then
  cp -r test/* contracts/test/ 2>/dev/null || mkdir -p contracts/test && cp -r test/* contracts/test/
  echo "✓ Moved tests to contracts/"
fi

echo "✓ Contract files reorganized"

