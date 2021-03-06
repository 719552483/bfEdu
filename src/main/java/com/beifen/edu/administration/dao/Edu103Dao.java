package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu103;

public interface Edu103Dao extends JpaRepository<Edu103, Long>, JpaSpecificationExecutor<Edu103> {

	// 查询所有培养层次
	@Query(value = "select * from edu103", nativeQuery = true)
	public List<Edu103> queryAllLevel();

	// 根据id删除培养层次
	@Transactional
	@Modifying
	@Query(value = "delete from edu103 where Edu103_ID =?1", nativeQuery = true)
	public void removeLevel(String edu103ID);

	// 根据id查询培养层次
	@Query(value = "select * from edu103 e where e.Edu103_ID=?1", nativeQuery = true)
	public List<Edu103> queryAllLevelByPcccbm(String edu300id);
	
	// 根据名称查培养层次id
	@Query(value = "select e.Edu103_ID from edu103 e where e.pyccmc=?1", nativeQuery = true)
	public String queryLevelCodeByLevelName(String edu300id);

	// 查询所有培养层次
	@Query(value = "select * from edu103 e where e.Edu103_ID=?1", nativeQuery = true)
	public Edu103 query103BYID(String edu300id);

	//根据培养层次查学制
	@Query(value = "select e.xz from edu103 e where e.Edu103_ID=?1", nativeQuery = true)
	public String queryXzByPyccbm(String queryXqbmByPyccbm);
	
	//根据培养层次查校区编码
	@Query(value = "select e.xq from edu103 e where e.Edu103_ID=?1", nativeQuery = true)
	public String queryXqbmByPyccbm(String pyccbm);
}
