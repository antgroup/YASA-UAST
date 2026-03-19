package uast

type Meta struct {
	Type            Type   `json:"type,omitempty"`
	Async           bool   `json:"async,omitempty"`
	Defer           bool   `json:"defer,omitempty"`
	ParameterKind   string `json:"parameterKind,omitempty"`
	ReceiveCls      string `json:"ReceiveCls"`
	IsInterface     bool   `json:"isInterface,omitempty"`
	IsDefaultImport bool   `json:"isDefaultImport,omitempty"`
}
