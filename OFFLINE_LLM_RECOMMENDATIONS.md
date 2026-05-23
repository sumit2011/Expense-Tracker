# Offline LLM Recommendations

## Overview

This document provides recommendations for integrating lightweight offline LLMs into your AI Financial Assistant for enhanced natural language understanding and response generation.

## Recommended Models

### Phase 1: Rule-Based (Current Implementation)
- **Status**: ✅ Implemented
- **Description**: Rule-based intent classification and template responses
- **Pros**: Fast, lightweight, no dependencies
- **Cons**: Limited flexibility, requires manual rule updates

### Phase 2: Lightweight LLM (Recommended for Enhancement)

#### Option 1: WebLLM (Browser-based)
- **Model**: Phi-3 Mini (3.8B) or TinyLlama (1.1B)
- **Size**: ~2-4GB (quantized)
- **Framework**: WebLLM / Transformers.js
- **Runtime**: WebGPU (modern browsers) / WASM (fallback)

**Installation:**
```bash
npm install @mlc-ai/web-llm
# or
npm install @xenova/transformers
```

**Implementation:**
```jsx
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const engine = await CreateMLCEngine({
  model: "Phi-3-mini-4k-instruct-q4f16_1-MLC"
});

const response = await engine.chat.completions.create({
  messages: [{ role: 'user', content: userQuery }]
});
```

#### Option 2: ONNX Runtime Web
- **Model**: Phi-3 Mini or similar
- **Size**: ~2-3GB (quantized)
- **Framework**: ONNX Runtime Web
- **Runtime**: WebAssembly + WebGPU

**Installation:**
```bash
npm install onnxruntime-web
```

**Implementation:**
```jsx
import { InferenceSession } from 'onnxruntime-web';

const session = await InferenceSession.create('model.onnx');
const results = await session.run({ input: tensor });
```

#### Option 3: TensorFlow Lite
- **Model**: MobileBERT or DistilBERT
- **Size**: ~50-100MB
- **Framework**: TensorFlow.js
- **Runtime**: WebGL / WASM

**Installation:**
```bash
npm install @tensorflow/tfjs
```

**Implementation:**
```jsx
import * as tf from '@tensorflow/tfjs';

const model = await tf.loadLayersModel('model.json');
const prediction = model.predict(inputTensor);
```

### Phase 3: Advanced AI (Future)

#### Mobile Native LLM
- **Model**: Llama 3.2 (1B/3B) or Gemma 2 (2B)
- **Size**: ~1-3GB (quantized)
- **Framework**: llama.cpp / MLC LLM
- **Runtime**: Native Android/iOS

## Model Comparison

| Model | Size | Accuracy | Speed | Memory | Recommendation |
|-------|------|----------|-------|--------|----------------|
| Rule-Based | 0KB | Medium | Fast | Low | Current |
| TinyLlama 1.1B | 1GB | Good | Medium | Medium | Web Enhancement |
| Phi-3 Mini 3.8B | 2GB | Excellent | Medium | Medium | Recommended |
| MobileBERT | 50MB | Good | Fast | Low | NLP Tasks Only |
| Llama 3.2 1B | 1GB | Excellent | Medium | Medium | Future |

## Implementation Strategy

### Step 1: Hybrid Approach (Recommended)

Combine rule-based system with LLM for best performance:

```jsx
class HybridAIAssistant {
  constructor() {
    this.ruleBased = new FinancialReasoningEngine();
    this.llm = null; // Optional LLM
  }

  async processQuery(query) {
    // Try rule-based first (fast)
    const ruleResult = this.ruleBased.processQuery(query);
    
    if (ruleResult.confidence > 0.8) {
      return ruleResult;
    }
    
    // Fall back to LLM if confidence is low
    if (this.llm) {
      return await this.llm.processQuery(query);
    }
    
    return ruleResult;
  }
}
```

### Step 2: Progressive Enhancement

1. **Start with rule-based** (current implementation)
2. **Add NLP model** for better intent classification
3. **Add generation model** for natural responses
4. **Optimize and compress** for mobile

### Step 3: Model Selection Criteria

Choose model based on:
- **APK size constraints** (target < 50MB increase)
- **Device capabilities** (WebGPU support, RAM)
- **Response time** (target < 2 seconds)
- **Accuracy requirements** (financial advice needs high accuracy)

## WebGPU Support Detection

```jsx
async function checkWebGPUSupport() {
  if (!navigator.gpu) {
    return false;
  }
  
  const adapter = await navigator.gpu.requestAdapter();
  return adapter !== null;
}

// Usage
const hasWebGPU = await checkWebGPUSupport();
if (hasWebGPU) {
  // Use WebGPU-accelerated model
} else {
  // Use WASM fallback or rule-based
}
```

## Model Optimization

### Quantization

Reduce model size through quantization:

```bash
# Using llama.cpp
./quantize model.gguf model-q4.gguf q4_k_m

# Using ONNX
python -m onnxruntime.quantization.preprocess \
  --model model.onnx \
  --output model-quantized.onnx \
  --per_channel
```

### Pruning

Remove less important weights:

```python
# Using transformers
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("model")
model = model.prune(0.3)  # Remove 30% of weights
model.save_pretrained("model-pruned")
```

### Knowledge Distillation

Train a smaller model to mimic a larger one:

```python
# Teacher-student training
teacher = LargeModel()
student = SmallModel()

# Train student to match teacher outputs
```

## Capacitor Integration

### Android Native LLM

For native Android integration:

1. **Add llama.cpp to Android project**

```gradle
// build.gradle
implementation 'com.github.llama.cpp:android:1.0.0'
```

2. **Create Capacitor Plugin**

```java
@CapacitorPlugin(name = "LLM")
public class LLMPlugin extends Plugin {
  @PluginMethod
  public void loadModel(PluginCall call) {
    String modelPath = call.getString("modelPath");
    // Load model using llama.cpp
    call.resolve();
  }
  
  @PluginMethod
  public void generate(PluginCall call) {
    String prompt = call.getString("prompt");
    // Generate response
    call.resolve(new JSObject().put("response", response));
  }
}
```

3. **Use in React**

```jsx
import { LLM } from '@capacitor-community/llm';

await LLM.loadModel({ modelPath: 'phi-3-mini.gguf' });
const result = await LLM.generate({ prompt: userQuery });
```

## Performance Benchmarks

### Expected Performance (Mobile)

| Model | Inference Time | Memory Usage | Battery Impact |
|-------|---------------|--------------|----------------|
| Rule-Based | <50ms | <10MB | Negligible |
| TinyLlama 1.1B | 500-1000ms | 500MB | Low |
| Phi-3 Mini 3.8B | 1000-2000ms | 1GB | Medium |
| MobileBERT | 100-300ms | 100MB | Very Low |

### Optimization Targets

- **Response time**: < 2 seconds
- **Memory usage**: < 500MB
- **Battery impact**: < 3% per hour
- **APK size increase**: < 50MB

## Battery Optimization

### Adaptive Model Selection

```jsx
class AdaptiveAI {
  async selectModel() {
    const batteryLevel = await navigator.getBattery();
    
    if (batteryLevel.level < 0.2) {
      return 'rule-based'; // Low battery
    }
    
    if (batteryLevel.charging) {
      return 'full-llm'; // Charging, use full model
    }
    
    return 'hybrid'; // Normal operation
  }
}
```

### Background Processing

```jsx
// Use background sync for model updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Security Considerations

### Model Integrity

- Verify model checksums
- Use signed models
- Detect tampering

### Privacy

- All processing on-device
- No data leaves device
- User can delete models

### Input Validation

```jsx
function validateInput(input) {
  // Sanitize input
  const sanitized = input.replace(/[<>]/g, '');
  
  // Length limit
  if (sanitized.length > 1000) {
    throw new Error('Input too long');
  }
  
  return sanitized;
}
```

## Implementation Roadmap

### Phase 1: Current (Rule-Based)
- ✅ Intent classification
- ✅ Template responses
- ✅ Financial calculations
- ✅ Context memory

### Phase 2: NLP Enhancement (Q2 2025)
- [ ] Add MobileBERT for intent classification
- [ ] Improve entity extraction
- [ ] Better context understanding
- Target: +10% accuracy, +50MB APK

### Phase 3: Generation Enhancement (Q3 2025)
- [ ] Add Phi-3 Mini for response generation
- [ ] Implement hybrid approach
- [ ] Add WebGPU support detection
- Target: +30% naturalness, +2GB storage

### Phase 4: Native Integration (Q4 2025)
- [ ] Native Android LLM integration
- [ ] iOS support
- [ ] Model optimization
- Target: +50% speed, -30% memory

## Recommendations

### For Current Implementation

**Stick with rule-based system** because:
- ✅ Fully functional
- ✅ Fast and lightweight
- ✅ No additional dependencies
- ✅ Works offline perfectly
- ✅ Zero APK size increase

### For Future Enhancement

**Add Phi-3 Mini with WebLLM** when:
- Users request more natural conversations
- Device capabilities improve
- APK size budget allows
- WebGPU support becomes widespread

### For Production

**Use hybrid approach**:
- Rule-based for common queries (fast)
- LLM for complex queries (accurate)
- Adaptive model selection (efficient)

## Conclusion

The current rule-based implementation is excellent for the MVP. For future enhancements, consider adding lightweight LLMs progressively based on user needs and device capabilities. Always prioritize performance, battery life, and APK size over model size.

## Resources

- [WebLLM Documentation](https://webllm.mlc.ai/)
- [Transformers.js](https://huggingface.co/docs/transformers.js)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/get-started/with-web/index.html)
- [llama.cpp](https://github.com/ggerganov/llama.cpp)
- [MLC LLM](https://mlc.ai/mlc-llm/)
