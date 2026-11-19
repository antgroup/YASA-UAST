use serde::Serialize;
use serde_json::Value;
use std::collections::BTreeMap;

pub const LANGUAGE: &str = "rust";
pub const LANGUAGE_VERSION: &str = "";

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Output {
    pub package_info: PackagePathInfo,
    pub module_name: String,
    pub cargo_toml_path: String,
    pub num_of_cargo_toml: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PackagePathInfo {
    pub path_name: String,
    pub files: BTreeMap<String, NodeInfo>,
    pub subs: BTreeMap<String, PackagePathInfo>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NodeInfo {
    pub node: CompileUnit,
    pub package_name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompileUnit {
    #[serde(rename = "type")]
    pub node_type: String,
    pub body: Vec<Value>,
    pub language: String,
    pub language_version: String,
    pub uri: String,
    pub version: String,
}

impl CompileUnit {
    pub fn empty(uri: String) -> Self {
        Self {
            node_type: "CompileUnit".to_string(),
            body: Vec::new(),
            language: LANGUAGE.to_string(),
            language_version: LANGUAGE_VERSION.to_string(),
            uri,
            version: String::new(),
        }
    }
}

impl PackagePathInfo {
    pub fn empty_root() -> Self {
        Self {
            path_name: "/".to_string(),
            files: BTreeMap::new(),
            subs: BTreeMap::new(),
        }
    }
}
